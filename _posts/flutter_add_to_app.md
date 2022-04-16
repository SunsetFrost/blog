---
title: Flutter混合工程初探
description: Flutter混合工程初探
thumbnail: /images/web-blog.jpg
date: 16 Apr 2022
categories: IT
---

# Flutter混合工程初探

- [Flutter混合工程初探](#flutter混合工程初探)
  - [混合安卓工程](#混合安卓工程)
    - [创建模版安卓项目](#创建模版安卓项目)
    - [创建Flutter Module](#创建flutter-module)
    - [添加`FlutterActivity`到`AndroidManifest.xml`](#添加flutteractivity到androidmanifestxml)
    - [Home页面中添加按钮打开Flutter页面](#home页面中添加按钮打开flutter页面)
    - [其他高级的Flutter引入方式](#其他高级的flutter引入方式)
      - [Flutter Fragment](#flutter-fragment)
      - [Flutter View](#flutter-view)
    - [遇到的问题](#遇到的问题)
  - [混合IOS工程](#混合ios工程)
    - [XCode创建项目](#xcode创建项目)
    - [添加Flutter Module](#添加flutter-module)
    - [添加flutter页面](#添加flutter页面)
      - [创建FlutterEngine](#创建flutterengine)
      - [在视图文件中添加按钮，增添打开Flutter页面功能](#在视图文件中添加按钮增添打开flutter页面功能)
  - [Flutter Boost3.0](#flutter-boost30)
    - [Flutter Boost的使用](#flutter-boost的使用)
  - [Flutter2.0版本FlutterEngineGroup特性](#flutter20版本flutterenginegroup特性)
  - [总结](#总结)

## 混合安卓工程

### 创建模版安卓项目
按照官方Android Studio引导初始化模板项目, 本文选择navigation app作为模版项目。

### 创建Flutter Module
在项目中`File -> New -> New Module`, 选择Flutter Module即可（需事先在Plugin中添加Flutter Plugin）。

另外可不用Android Studio自动创建Flutter Module的方式，而是以手动方式就行创建，具体较为复杂，参照[官网](https://docs.flutter.dev/development/add-to-app/android/project-setup#manual-integration)

### 添加`FlutterActivity`到`AndroidManifest.xml`
将`FlutterActivity`注册到`AndroidManifest.xml`配置中。
```xml
<activity
    android:name="io.flutter.embedding.android.FlutterActivity"
    android:theme="@style/AppTheme"
    android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
    android:hardwareAccelerated="true"
    android:windowSoftInputMode="adjustResize">
</activity>
```

### Home页面中添加按钮打开Flutter页面
引用FlutterAcitivity并在按钮事件中创建FlutterActivity.
```java
import io.flutter.embedding.android.FlutterActivity;

public class HomeFragment extends Fragment {

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        
        View root = inflater.inflate(R.layout.fragment_home, container, false);

        // get current activity
        FragmentActivity currentActivity = this.getActivity();

        // define flutter button
        Button btnOpenFlutter = root.findViewById(R.id.button);
        // add function to button
        btnOpenFlutter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(
                        FlutterActivity.createDefaultIntent(currentActivity)
                );
            }
        });

        return root;
    }
}
```
### 其他高级的Flutter引入方式
#### Flutter Fragment  

将一个`Flutter Fragment`添加至应用，相比于上文的`Single View`，`FlutterFragment`能在如下方面提升开发体验。  
- Initial Flutter route
- Dart entrypoint to execute
- Opaque vs translucent background
- Whether FlutterFragment should control its surrounding Activity
- Whether a new FlutterEngine or a cached FlutterEngine should be used

#### Flutter View
高级功能，需要手动桥接`FlutterEngine`, 能够添加至任何`activity`.

### 遇到的问题
-  AAPT: error: resource android:attr/lStar not found.  
查资料得是SDK版本导致的问题，可通过更改`build.gradle`文件的 `androidx.core:core-ktx:+`为固定版本号`androidx.core:core-ktx:1.6.0`，或修改项目依赖版本解决。

## 混合IOS工程
### XCode创建项目

### 添加Flutter Module
首先创建或使用现有的Flutter Module.
```bash
cd some/path/
flutter create --template module flutter_module
```

文件目录如下
```
my_flutter/
├── .ios/ 
│   ├── Runner.xcworkspace 
│   └── Flutter/podhelper.rb
├── lib/
│   └── main.dart
├── test/
└── pubspec.yaml
```

添加Flutter Module有两种方法
- 通过CocoPods依赖管理工具安装(官方推荐)
- 手动创建并引入`frameworks`，更新Xcode中的项目编译设置

CocoPods添加Flutter
1. 创建Podfile
```
pod init
```

2. 添加相关配置至Podfile
```
flutter_application_path = '../flutter_module'
load File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')
```

3. 每个`Pod target`引入Flutter
```
target 'MyApp' do
  install_all_flutter_pods(flutter_application_path)
end
```

4. 运行`pod install`

### 添加flutter页面

#### 创建FlutterEngine
项目入口创建FlutterEngine

`AppDelegate.swift`
```swift
import UIKit
import Flutter

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    var flutterEngine : FlutterEngine?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Instantiate Flutter engine
        self.flutterEngine = FlutterEngine(name: "io.flutter", project: nil)
        self.flutterEngine?.run(withEntrypoint: nil)

        return true
    }
}
```

#### 在视图文件中添加按钮，增添打开Flutter页面功能
`ViewController`
```swift
    // button click func
    @IBAction func buttonWasTapped(_ sender: Any) {
        if let flutterEngine = (UIApplication.shared.delegate as? AppDelegate)?.flutterEngine {
            let flutterViewController = FlutterViewController(engine: flutterEngine, nibName: nil, bundle: nil)
            self.present(flutterViewController, animated: true, completion: nil)
        }
    }
```

## Flutter Boost3.0
Flutter Booset是闲鱼技术团队提出的Flutter混合开发解决方案。官方原生混合方案在Flutter页面与原生页面消息传递，页面生命周期管理等方面存在不足，因此Flutter Boost基于以上问题提出了单个共享`Engine`实现混合开发的方式，在3.0版本的更新中，重构了2.0中对于Flutter引擎的修改，以无入侵的方式提供混合开发及页面间通信能力。

### Flutter Boost的使用
Flutter Boost集成方法并不复杂，相比于原始集成只需要增加较少配置即可，详细可按[官方文档](https://github.com/alibaba/flutter_boost/blob/master/docs/install.md)步骤完成。  

## Flutter2.0版本FlutterEngineGroup特性
Flutter2.0版本更新后对1.x版本混合开发体验较差的问题进行了优化，官方提供的特性就是FlutterEngineGroup。

FlutterEngineGroup使用了多engine的引擎模式，相比于之前没增加一个engine会多出10几M内存占用，FlutterEngineGroup能够使后续新增加的engine仅占用180kb。

FlutterEngineGroup的API较为简单，官方也提供了[入门例子](https://github.com/flutter/samples/tree/master/add_to_app/multiple_flutters)供开发者熟悉。

![](https://docs.flutter.dev/assets/images/docs/development/add-to-app/multiple-flutters-sample.gif)

然而每个Flutter页面是一个独立的Engine, Flutter Engine之间内存不能共享，当需要共享数据时，只能通过原生层持有数据，通过注入或传递的方式提供给每个Flutter Engine。

## 总结
本文概述了Flutter框架的混合开发模式，从原生的Add To方案到第三方框架Flutter Boost，至Flutter2.0版本的FlutterEngineGroup，目前项目使用上可根据实际需求采用Flutter Boost或FlutterEngineGroup，两者一个为单引擎共享，一个为多引擎，单引擎在数据同步共享上有较大优势，而FlutterEngineGroup为官方方案，不受后续Flutter版本更新对于API的影响，且有更大的发展空间。