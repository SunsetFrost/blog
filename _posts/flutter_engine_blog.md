---
title: Flutter渲染流程的源码梳理解析-基于Flutter3.0的Framework层&Engine层源码
description: FLutter中万物皆为widget，而widget的UI变化是如何实现的？本文将以widget的setState为起点，从源码角度探究当UI变化时，Flutter Framework与Engine层的渲染机制，及Framework层与Engine的交互过程。
thumbnail: /images/flutter_source_code.png
date: 6 June 2022
categories: IT
---

Flutter渲染流程的源码梳理解析-基于Flutter3.0的Framework层&Engine层源码

> FLutter中万物皆为widget，而widget的UI变化是如何实现的？本文将以widget的setState为起点，从源码角度探究当UI变化时，Flutter Framework与Engine层的渲染机制，及Framework层与Engine的交互过程。

![](/images/flutter_source_code.png)

- [Framework](#framework)
  - [setState触发widget渲染流程-标记脏元素](#setstate触发widget渲染流程-标记脏元素)
  - [onBuildScheduled回调函数触发`scheduleFrame`](#onbuildscheduled回调函数触发scheduleframe)
  - [调用`scheduleFrame`触发Engine层对应方法](#调用scheduleframe触发engine层对应方法)
- [Engine](#engine)
  - [Platform发起绘制动作](#platform发起绘制动作)
  - [Vsync信号注册](#vsync信号注册)
  - [BeginFrame执行绘制过程](#beginframe执行绘制过程)
  - [回调Framework`begin_frame_`和`draw_frame_`绘制流程](#回调frameworkbegin_frame_和draw_frame_绘制流程)
- [Framework](#framework-1)
  - [Engine回调`handleBeginFrame`](#engine回调handlebeginframe)
  - [Engine回调`handleDrawFrame`](#engine回调handledrawframe)
  - [Render的drawFrame方法](#render的drawframe方法)
    - [1. flushLayout 渲染流水线的核心步骤之一，更新所有脏元素的布局信息](#1-flushlayout-渲染流水线的核心步骤之一更新所有脏元素的布局信息)
    - [2. flushCompositingBits 更新被标记为`RenderObject.needsCompositing`的元素的bits.](#2-flushcompositingbits-更新被标记为renderobjectneedscompositing的元素的bits)
    - [3. `flushPaint`为全部渲染元素更新展示列表，是渲染流水线的核心步骤，在`layout`之后，`recomposited`（重新合成）之前，保证使用最新的展示列表进行渲染。](#3-flushpaint为全部渲染元素更新展示列表是渲染流水线的核心步骤在layout之后recomposited重新合成之前保证使用最新的展示列表进行渲染)
    - [4. compositeFrame 上传合成的layer tree至engine](#4-compositeframe-上传合成的layer-tree至engine)
    - [5. flushSemantics 更新渲染元素的语义](#5-flushsemantics-更新渲染元素的语义)
  - [Widgets的drawFrame方法](#widgets的drawframe方法)

# Framework

## setState触发widget渲染流程-标记脏元素

setState去除大量assert断言后，核心代码实际只有一行，即将组件标记为需要重新构建的状态。

```dart
@protected
void setState(VoidCallback fn) {
	_element!.markNeedsBuild();
}
```

标记方法`markNeedsBuild`中进行渲染步骤的判断，为了防止组件多次渲染，必须保证在frame begin之前渲染，而不是在构建过程中渲染。判断后执行构建的关键方法`scheduleBuilderFor`.

```dart
void markNeedsBuild() {
	if (_lifecycleState != _ElementLifecycle.active)
	      return;
	if (dirty)
      return;
  _dirty = true;
  owner!.scheduleBuildFor(this);
}
```

组件标记为脏状态后，通过`scheduleBuildFor`方法添加element至脏元素列表。之后执行`onBuildScheduled`回调函数，关键在于该回调函数的调用时机。

```dart
  void scheduleBuildFor(Element element) {
    if (element._inDirtyList) {
      _dirtyElementsNeedsResorting = true;
      return;
    }
    if (!_scheduledFlushDirtyElements && onBuildScheduled != null) {
      _scheduledFlushDirtyElements = true;
      onBuildScheduled!();
    }
    _dirtyElements.add(element);
    element._inDirtyList = true;
  }
```

## onBuildScheduled回调函数触发`scheduleFrame`

上文的`onBuildScheduled`在binding.dart中将被胶水类`WidgetBinding`调用，并将脏元素列表中的元素重新构建。如下为`onBuildScheduled`的赋值过程。

```dart
mixin WidgetsBinding on BindingBase, ServicesBinding, SchedulerBinding, GestureBinding, RendererBinding, SemanticsBinding {
  @override
  void initInstances() {
    super.initInstances();
    _instance = this;

    _buildOwner = BuildOwner();
		// onBuildScheduled赋值
    buildOwner!.onBuildScheduled = _handleBuildScheduled;
    platformDispatcher.onLocaleChanged = handleLocaleChanged;
    platformDispatcher.onAccessibilityFeaturesChanged = handleAccessibilityFeaturesChanged;
    SystemChannels.navigation.setMethodCallHandler(_handleNavigationInvocation);
    platformMenuDelegate = DefaultPlatformMenuDelegate();
	}
}
```

值得一提的是胶水类组合的各个类的顺序是有意义的，对于类中的同名的方法后面的类会顶替前面的类，因此`BindingBase`会位于第一个。

## 调用`scheduleFrame`触发Engine层对应方法

接下来依次调用`_handleBuildScheduled`->`ensureVisualUpdate.`

```dart
void _handleBuildScheduled() {
  ensureVisualUpdate();
}

void ensureVisualUpdate() {
  switch (schedulerPhase) {
    case SchedulerPhase.idle:
    case SchedulerPhase.postFrameCallbacks:
      scheduleFrame();
      return;
    case SchedulerPhase.transientCallbacks:
    case SchedulerPhase.midFrameMicrotasks:
    case SchedulerPhase.persistentCallbacks:
      return;
  }
}
```

schedulePhase具有五种状态

- `idle` 没有正在处理的帧，可能为scheduleTask，微任务，Timer，其他handlers或回调函数正在执行
- `transientCallbacks` scheduleFrameCallback正在执行，一般为更新动画状态
- `midFrameMicrotasks`  transient处理阶段执行的微任务
- `persistentCallbacks`  addPersistentFrameCallback正在执行，一般为build/layout/paint流水线工作
- `postFrameCallbacks`  一般为清除和准备下一帧工作

由以上状态可知，当SchedulerPhase处于`transientCallbacks`或`midFrameMicrotasks`（帧正处于准备状态），`persistentCallbacks`（帧正处于渲染状态）时，渲染步骤不会执行。只有当SchedulerPhase处于`idle`（帧与帧之间）或`postFrameCallbacks`（一帧结束）时渲染才会执行，此时执行`scheduleFrame`。

`scheduleFrame`方法最终调用引擎层对应的`scheduleFrame`方法。

```dart
	void scheduleFrame() {
    if (_hasScheduledFrame || !framesEnabled)
      return;
    ensureFrameCallbacksRegistered();
    platformDispatcher.scheduleFrame();
    _hasScheduledFrame = true;
  }
```

该方法对应engine层的`scheduleFrame`方法

```dart
void scheduleFrame() native 'PlatformConfiguration_scheduleFrame';
```

# Engine

## Platform发起绘制动作

/lib/ui/window/platform_configuration.cc

```cpp
void ScheduleFrame(Dart_NativeArguments args) {
  UIDartState::ThrowIfUIOperationsProhibited();
  UIDartState::Current()->platform_configuration()->client()->ScheduleFrame();
}
```

/shell/common/platform_view.cc

```cpp
void PlatformView::ScheduleFrame() {
  delegate_.OnPlatformViewScheduleFrame();
}
```

/shell/common/shell.cc

```cpp
// |PlatformView::Delegate|
void Shell::OnPlatformViewScheduleFrame() {
  task_runners_.GetUITaskRunner()->PostTask([engine = engine_->GetWeakPtr()]() {
    if (engine) {
      engine->ScheduleFrame();
    }
  });
}
```

经过Plateform层一系列代理和调用，最终调用engine的`ScheduleFrame`方法。

/shell/common/engine.cc

```cpp
void Engine::ScheduleFrame(bool regenerate_layer_tree) {
  animator_->RequestFrame(regenerate_layer_tree);
}
```

## Vsync信号注册

engine开始执行在UI线程上的绘制处理流程，由上文代码可知首先触发animator类的`RequestFrame`方法，并在对vsync信号进行判断后将真正需发送的vsync信号通过`PostTask`方法将`AwaitVSync`任务放入`UI Task Runner`执行。

```cpp
void Animator::RequestFrame(bool regenerate_layer_tree) {
  if (regenerate_layer_tree) {
    regenerate_layer_tree_ = true;
  }

  if (!pending_frame_semaphore_.TryWait()) {
    // 多个vsync请求时也保证一帧内只有一个vsync被执行
    return;
  }

  task_runners_.GetUITaskRunner()->PostTask(
      [self = weak_factory_.GetWeakPtr(),
       frame_request_number = frame_request_number_]() {
        if (!self) {
          return;
        }
        TRACE_EVENT_ASYNC_BEGIN0("flutter", "Frame Request Pending",
                                 frame_request_number);
        self->AwaitVSync();
      });
  frame_scheduled_ = true;
}
```

判断是否能够复用LayerTree, 若能则绘制上一个LayerTree—执行`DrawLastLayerTree`，若不能则开始新的LayerTree的绘制——执行`BeginFrame`。

```cpp
void Animator::AwaitVSync() {
  waiter_->AsyncWaitForVsync(
      [self = weak_factory_.GetWeakPtr()](
          std::unique_ptr<FrameTimingsRecorder> frame_timings_recorder) {
        if (self) {
          if (self->CanReuseLastLayerTree()) {
            self->DrawLastLayerTree(std::move(frame_timings_recorder));
          } else {
            self->BeginFrame(std::move(frame_timings_recorder));
          }
        }
      });
  if (has_rendered_) {
    delegate_.OnAnimatorNotifyIdle(dart_frame_deadline_);
  }
}
```

## BeginFrame执行绘制过程

engine开始从`BeginFrame`执行绘制过程，首先会记录`frame_request_number_`，并判断流水线是否繁忙，如繁忙则结束本次绘制，重新注册vsync。

/shell/common/animator.cc

```cpp
void Animator::BeginFrame(
    std::unique_ptr<FrameTimingsRecorder> frame_timings_recorder) {
  TRACE_EVENT_ASYNC_END0("flutter", "Frame Request Pending",
                         frame_request_number_);
  // 开始绘制，frame_request_number_自增1，当下一个vsync信号到来时判断当前是否存在正在绘制的帧
	frame_request_number_++;

  frame_timings_recorder_ = std::move(frame_timings_recorder);
  frame_timings_recorder_->RecordBuildStart(fml::TimePoint::Now());

  TRACE_EVENT_WITH_FRAME_NUMBER(frame_timings_recorder_, "flutter",
                                "Animator::BeginFrame");

  frame_scheduled_ = false;
  notify_idle_task_id_++;
  regenerate_layer_tree_ = false;
  pending_frame_semaphore_.Signal();

  if (!producer_continuation_) {
    producer_continuation_ = layer_tree_pipeline_->Produce();

		// 如果流水线占满，则重新注册vsync
    if (!producer_continuation_) {
      TRACE_EVENT0("flutter", "PipelineFull");
      RequestFrame();
      return;
    }
  }

	FML_DCHECK(producer_continuation_);
  fml::tracing::TraceEventAsyncComplete(
      "flutter", "VsyncSchedulingOverhead",
      frame_timings_recorder_->GetVsyncStartTime(),
      frame_timings_recorder_->GetBuildStartTime());
  const fml::TimePoint frame_target_time =
      frame_timings_recorder_->GetVsyncTargetTime();
  dart_frame_deadline_ = FxlToDartOrEarlier(frame_target_time);
  uint64_t frame_number = frame_timings_recorder_->GetFrameNumber();
	// 回调函数，执行shell对应方法
  delegate_.OnAnimatorBeginFrame(frame_target_time, frame_number);
}
```

在shell中执行`OnAnimatorBeginFrame`，委托至engine中执行。

/shell
```cpp
void Shell::OnAnimatorBeginFrame(fml::TimePoint frame_target_time,
                                 uint64_t frame_number) {
  if (engine_) {
    engine_->BeginFrame(frame_target_time, frame_number);
  }
}
```

/engine
```cpp
void Engine::BeginFrame(fml::TimePoint frame_time, uint64_t frame_number) {
  runtime_controller_->BeginFrame(frame_time, frame_number);
}
```

/runtime/runtime_controller.cc
```cpp
bool RuntimeController::BeginFrame(fml::TimePoint frame_time,
                                   uint64_t frame_number) {
  if (auto* platform_configuration = GetPlatformConfigurationIfAvailable()) {
    platform_configuration->BeginFrame(frame_time, frame_number);
    return true;
  }

  return false;
}
```

## 回调Framework`begin_frame_`和`draw_frame_`绘制流程
/lib/ui/window/platform_configuration.cc
```cpp
void PlatformConfiguration::BeginFrame(fml::TimePoint frameTime,
                                       uint64_t frame_number) {
  std::shared_ptr<tonic::DartState> dart_state =
      begin_frame_.dart_state().lock();
  if (!dart_state) {
    return;
  }
  tonic::DartState::Scope scope(dart_state);

  int64_t microseconds = (frameTime - fml::TimePoint()).ToMicroseconds();

	// 开始帧
  tonic::CheckAndHandleError(
      tonic::DartInvoke(begin_frame_.Get(), {
                                                Dart_NewInteger(microseconds),
                                                Dart_NewInteger(frame_number),
                                            }));

	// 处理微任务
  UIDartState::Current()->FlushMicrotasksNow();

	// 绘制帧
  tonic::CheckAndHandleError(tonic::DartInvokeVoid(draw_frame_.Get()));
}
```

# Framework

## Engine回调`handleBeginFrame`

上文代码`tonic::DartInvoke`会触发Framework层的`begin_frame_`和`draw_frame_`绘制流程，下文展开加以描述。

`handleBeginFrame`方法调用全部已注册的`transient frame callbacks`回调函数，当其返回时，全部微任务处于正在运行的状态，并开始执行`handleDrawFrame`方法继续渲染过程。

```dart
	void handleBeginFrame(Duration? rawTimeStamp) {
    _frameTimelineTask?.start('Frame', arguments: timelineArgumentsIndicatingLandmarkEvent);
    _firstRawTimeStampInEpoch ??= rawTimeStamp;
    _currentFrameTimeStamp = _adjustForEpoch(rawTimeStamp ?? _lastRawTimeStamp);
    if (rawTimeStamp != null)
      _lastRawTimeStamp = rawTimeStamp;

    try {
      // TRANSIENT FRAME CALLBACKS
      _frameTimelineTask?.start('Animate', arguments: timelineArgumentsIndicatingLandmarkEvent);
      _schedulerPhase = SchedulerPhase.transientCallbacks;
      final Map<int, _FrameCallbackEntry> callbacks = _transientCallbacks;
      _transientCallbacks = <int, _FrameCallbackEntry>{};
      callbacks.forEach((int id, _FrameCallbackEntry callbackEntry) {
        if (!_removedIds.contains(id))
          _invokeFrameCallback(callbackEntry.callback, _currentFrameTimeStamp!, callbackEntry.debugStack);
      });
      _removedIds.clear();
    } finally {
      _schedulerPhase = SchedulerPhase.midFrameMicrotasks;
    }
  }
```

## Engine回调`handleDrawFrame`
`handleDrawFrame`由引擎层调用用以创建新的一帧。

该方法在`handleBeginFrame`方法后立即被调用，依次调用渲染流水线的回调函数——`addPersistentFrameCallback`，接着调用由`addPostFrameCallback`注册的一系列回调函数。

```dart
	void handleDrawFrame() {
    _frameTimelineTask?.finish(); // end the "Animate" phase
    try {
      // PERSISTENT FRAME CALLBACKS
      _schedulerPhase = SchedulerPhase.persistentCallbacks;
      for (final FrameCallback callback in _persistentCallbacks)
        _invokeFrameCallback(callback, _currentFrameTimeStamp!);

      // POST-FRAME CALLBACKS
      _schedulerPhase = SchedulerPhase.postFrameCallbacks;
      final List<FrameCallback> localPostFrameCallbacks =
          List<FrameCallback>.of(_postFrameCallbacks);
      _postFrameCallbacks.clear();
      for (final FrameCallback callback in localPostFrameCallbacks)
        _invokeFrameCallback(callback, _currentFrameTimeStamp!);
    } finally {
      _schedulerPhase = SchedulerPhase.idle;
      _frameTimelineTask?.finish(); // end the Frame

      _currentFrameTimeStamp = null;
    }
  }
```


执行PERSISTENT FRAME注册的回调  

/schedule/binding.dart
```dart
  void _invokeFrameCallback(FrameCallback callback, Duration timeStamp, [ StackTrace? callbackStack ]) {
    try {
      callback(timeStamp);
    } catch (exception, exceptionStack) {
      ...
    }
  }
}
```

PERSISTENT FRAME回调函数是如何注册的呢，跟踪代码可知其在`rending binding`的初始化过程进行赋值。  
/rending/RenderBinding
```dart
mixin RendererBinding on BindingBase, ServicesBinding, SchedulerBinding, GestureBinding, SemanticsBinding, HitTestable {
  @override
  void initInstances() {
    super.initInstances();

    addPersistentFrameCallback(_handlePersistentFrameCallback);
  }
```

/render/binding.dart

```dart
void _handlePersistentFrameCallback(Duration timeStamp) {
    drawFrame();
    _scheduleMouseTrackerUpdate();
  }
```

## Render的drawFrame方法
/rendering/binding.dart
```dart
	@protected
  void drawFrame() {
    assert(renderView != null);
    pipelineOwner.flushLayout();
    pipelineOwner.flushCompositingBits();
    pipelineOwner.flushPaint();
    if (sendFramesToEngine) {
      renderView.compositeFrame(); // this sends the bits to the GPU
      pipelineOwner.flushSemantics(); // this also sends the semantics to the OS.
      _firstFrameSent = true;
    }
  }
```

### 1. flushLayout 渲染流水线的核心步骤之一，更新所有脏元素的布局信息

```dart
void flushLayout() {
    if (!kReleaseMode) {
      Map<String, String> debugTimelineArguments = timelineArgumentsIndicatingLandmarkEvent;
      assert(() {
        if (debugProfileLayoutsEnabled) {
          debugTimelineArguments = <String, String>{
            ...debugTimelineArguments,
            'dirty count': '${_nodesNeedingLayout.length}',
            'dirty list': '$_nodesNeedingLayout',
          };
        }
        return true;
      }());
      Timeline.startSync(
        'LAYOUT',
        arguments: debugTimelineArguments,
      );
    }
    assert(() {
      _debugDoingLayout = true;
      return true;
    }());
    try {
      while (_nodesNeedingLayout.isNotEmpty) {
        final List<RenderObject> dirtyNodes = _nodesNeedingLayout;
        _nodesNeedingLayout = <RenderObject>[];
        for (final RenderObject node in dirtyNodes..sort((RenderObject a, RenderObject b) => a.depth - b.depth)) {
          if (node._needsLayout && node.owner == this)
            node._layoutWithoutResize();
        }
      }
    } finally {
      assert(() {
        _debugDoingLayout = false;
        return true;
      }());
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```

### 2. flushCompositingBits 更新被标记为`RenderObject.needsCompositing`的元素的bits.

/rendering/object.dart
```dart
void flushCompositingBits() {
    if (!kReleaseMode) {
      Timeline.startSync('UPDATING COMPOSITING BITS', arguments: timelineArgumentsIndicatingLandmarkEvent);
    }
    _nodesNeedingCompositingBitsUpdate.sort((RenderObject a, RenderObject b) => a.depth - b.depth);
    for (final RenderObject node in _nodesNeedingCompositingBitsUpdate) {
      if (node._needsCompositingBitsUpdate && node.owner == this)
        node._updateCompositingBits();
    }
    _nodesNeedingCompositingBitsUpdate.clear();
    if (!kReleaseMode) {
      Timeline.finishSync();
    }
  }
```

### 3. `flushPaint`为全部渲染元素更新展示列表，是渲染流水线的核心步骤，在`layout`之后，`recomposited`（重新合成）之前，保证使用最新的展示列表进行渲染。

/rendering/object.dart
```dart
	void flushPaint() {
    if (!kReleaseMode) {
      Map<String, String> debugTimelineArguments = timelineArgumentsIndicatingLandmarkEvent;
      assert(() {
        if (debugProfilePaintsEnabled) {
          debugTimelineArguments = <String, String>{
            ...debugTimelineArguments,
            'dirty count': '${_nodesNeedingPaint.length}',
            'dirty list': '$_nodesNeedingPaint',
          };
        }
        return true;
      }());
      Timeline.startSync(
        'PAINT',
        arguments: debugTimelineArguments,
      );
    }
    assert(() {
      _debugDoingPaint = true;
      return true;
    }());
    try {
      final List<RenderObject> dirtyNodes = _nodesNeedingPaint;
      _nodesNeedingPaint = <RenderObject>[];
      // Sort the dirty nodes in reverse order (deepest first).
      for (final RenderObject node in dirtyNodes..sort((RenderObject a, RenderObject b) => b.depth - a.depth)) {
        assert(node._layerHandle.layer != null);
        if (node._needsPaint && node.owner == this) {
          if (node._layerHandle.layer!.attached) {
            PaintingContext.repaintCompositedChild(node);
          } else {
            node._skippedPaintingOnLayer();
          }
        }
      }
      assert(_nodesNeedingPaint.isEmpty);
    } finally {
      assert(() {
        _debugDoingPaint = false;
        return true;
      }());
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```

### 4. compositeFrame 上传合成的layer tree至engine
```dart
	void compositeFrame() {
    if (!kReleaseMode) {
      Timeline.startSync('COMPOSITING', arguments: timelineArgumentsIndicatingLandmarkEvent);
    }
    try {
      final ui.SceneBuilder builder = ui.SceneBuilder();
      final ui.Scene scene = layer!.buildScene(builder);
      if (automaticSystemUiAdjustment)
        _updateSystemChrome();
      _window.render(scene);
      scene.dispose();
      assert(() {
        if (debugRepaintRainbowEnabled || debugRepaintTextRainbowEnabled)
          debugCurrentRepaintColor = debugCurrentRepaintColor.withHue((debugCurrentRepaintColor.hue + 2.0) % 360.0);
        return true;
      }());
    } finally {
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```

### 5. flushSemantics 更新渲染元素的语义

```dart
void flushSemantics() {
    if (_semanticsOwner == null)
      return;
    if (!kReleaseMode) {
      Timeline.startSync('SEMANTICS', arguments: timelineArgumentsIndicatingLandmarkEvent);
    }
    assert(_semanticsOwner != null);
    assert(() {
      _debugDoingSemantics = true;
      return true;
    }());
    try {
      final List<RenderObject> nodesToProcess = _nodesNeedingSemantics.toList()
        ..sort((RenderObject a, RenderObject b) => a.depth - b.depth);
      _nodesNeedingSemantics.clear();
      for (final RenderObject node in nodesToProcess) {
        if (node._needsSemanticsUpdate && node.owner == this)
          node._updateSemantics();
      }
      _semanticsOwner!.sendSemanticsUpdate();
    } finally {
      assert(_nodesNeedingSemantics.isEmpty);
      assert(() {
        _debugDoingSemantics = false;
        return true;
      }());
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```

## Widgets的drawFrame方法
上文介绍了胶水类rendering/binding时中`drawFrame`的流程，该步骤在项目初始化时，即runApp过程中通过WidgetsFlutterBinding初始化，因此widget binding也继承并重写了`drawFrame`方法。

/widgets/binding.dart
```dart
 @override
  void drawFrame() {
    try {
      if (renderViewElement != null) {
        buildOwner!.buildScope(renderViewElement!);
      }
      super.drawFrame();
      buildOwner!.finalizeTree();
    } finally {
      assert(() {
        debugBuildingDirtyElements = false;
        return true;
      }());
    }
    if (!kReleaseMode) {
      if (_needToReportFirstFrame && sendFramesToEngine) {
        developer.Timeline.instantSync('Widgets built first useful frame');
      }
    }
    _needToReportFirstFrame = false;
    if (firstFrameCallback != null && !sendFramesToEngine) {
      // This frame is deferred and not the first frame sent to the engine that
      // should be reported.
      _needToReportFirstFrame = true;
      SchedulerBinding.instance.removeTimingsCallback(firstFrameCallback!);
    }
  }
```
建立需要更新的`widget tree`,调用注册过的`callback`，并以深度遍历顺序`build`所有在`scheduleBuildFor`阶段被标记的脏元素。

/widgets/framework.dart
```dart
  void buildScope(Element context, [ VoidCallback? callback ]) {
    if (callback == null && _dirtyElements.isEmpty) {
      return;
    }

    try {
      _scheduledFlushDirtyElements = true;
      if (callback != null) {
        Element? debugPreviousBuildTarget;
        _dirtyElementsNeedsResorting = false;
        try {
          callback();
        }
      }
      _dirtyElements.sort(Element._sort);
      _dirtyElementsNeedsResorting = false;
      int dirtyCount = _dirtyElements.length;
      int index = 0;
      while (index < dirtyCount) {
        final Element element = _dirtyElements[index];
          return true;
        }());
        // 重新build element
        try {
          element.rebuild();
        } catch (e, stack) {
          _debugReportException(
            ...
          );
        }

        index += 1;
        if (dirtyCount < _dirtyElements.length || _dirtyElementsNeedsResorting!) {
          _dirtyElements.sort(Element._sort);
          _dirtyElementsNeedsResorting = false;
          dirtyCount = _dirtyElements.length;
          while (index > 0 && _dirtyElements[index - 1].dirty) {
            index -= 1;
          }
        }
      }
    } finally {
      for (final Element element in _dirtyElements) {
        element._inDirtyList = false;
      }
      _dirtyElements.clear();
      _scheduledFlushDirtyElements = false;
      _dirtyElementsNeedsResorting = null;
    }
  }
```

所有脏元素构建结束后，调用`buildOwner!.finalizeTree()`完成构建阶段。
```dart
@pragma('vm:notify-debugger-on-exception')
  void finalizeTree() {
    if (!kReleaseMode) {
      Timeline.startSync('FINALIZE TREE');
    }
    try {
      lockState(_inactiveElements._unmountAll); // this unregisters the GlobalKeys
    } catch (e, stack) {
      _debugReportException(ErrorSummary('while finalizing the widget tree'), e, stack);
    } finally {
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```

以上便为Flutter渲染流程的源码梳理解析的全部源码解析。