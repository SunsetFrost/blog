---
title: Flutter实战-搭建一个UI/业务/数据分层的电影App
description: 本文基于Flutter框架，依照BLoc Pattern，逐步搭建一个具有查看，搜索电影列表，展示电影预告片及详情功能的电影App。其中第三方电影数据API使用TMDB数据，通过FLutter Package拆分为数据层，业务层，Feature层。
thumbnail: /images/frp-thumbnail.jpg
date: 1 Apr 2022
categories: IT
---

# Flutter实战-搭建一个UI/业务/数据分层的电影App
> 本文基于Flutter框架，依照BLoc Pattern，逐步搭建一个具有查看，搜索电影列表，展示电影预告片及详情功能的电影App。其中第三方电影数据API使用TMDB数据，通过FLutter Package拆分为数据层，业务层，Feature层。

![movie](/images/media_library_movie.gif)

本文将介绍如下特性
- Flutter Json序列化
- Bloc Pattern
- 长列表无限滚动
- 视频Widget与图片Widget

- [Flutter实战-搭建一个UI/业务/数据分层的电影App](#flutter实战-搭建一个ui业务数据分层的电影app)
  - [架构](#架构)
  - [数据层](#数据层)
    - [创建Package](#创建package)
    - [网络请求包Dio](#网络请求包dio)
      - [数据源](#数据源)
      - [网络请求](#网络请求)
    - [JSON自动转换Dart类](#json自动转换dart类)
      - [Json转换](#json转换)
      - [消费自动生成的实体类](#消费自动生成的实体类)
    - [测试数据](#测试数据)
  - [业务层](#业务层)
    - [Bloc简介](#bloc简介)
    - [创建电影列表的Bloc](#创建电影列表的bloc)
      - [需求分析](#需求分析)
      - [Bloc State](#bloc-state)
      - [Bloc Event](#bloc-event)
      - [Bloc logic](#bloc-logic)
  - [UI层](#ui层)
    - [Bloc消费](#bloc消费)
    - [抽象通用组件](#抽象通用组件)
      - [列表组件](#列表组件)
      - [卡片组件](#卡片组件)
      - [通用组件使用](#通用组件使用)
  - [结语](#结语)

## 架构
![手绘架构图](/images/meida_library_architechture.png)

## 数据层
数据层使用dart package方式构建，为业务层提供数据，同时分离业务与数据，符合单一职责原则，降低数据对于整体App的影响，提高基础数据的可重用性。

### 创建Package
Package允许flutter以模块化的方式组织代码，便于共享。
```bash
 flutter create --template=package moviedb_api
```

### 网络请求包Dio
#### 数据源
电影数据使用[TMDB](https://developers.themoviedb.org/3/getting-started/introduction)提供的API, 其支持热门电影列表与搜索电影功能。

#### 网络请求
官方教程中使用[http](https://pub.dev/packages/http)包进行网络请求，使用方式如下
```dart 
import 'package:http/http.dart' as http;

var url = Uri.parse('https://example.com/whatsit/create');
var response = await http.post(url, body: {'name': 'doodle', 'color': 'blue'});
print('Response status: ${response.statusCode}');
print('Response body: ${response.body}');

print(await http.read(Uri.parse('https://example.com/foobar.txt')));
```

笔者推荐使用dio网络请求包，除了基础的网络请求功能，dio封装了中间件拦截，全剧配置，表单，请求取消等功能。基于dio包封装API请求类核心代码如下:
```dart
class CommonAPIRequestFailure implements Exception {}

abstract class CommonAPI {
  CommonAPI({required baseUrl}) : dio = Dio(BaseOptions(baseUrl: baseUrl));

  Dio dio;

  @protected
  String get endPoint;

  @protected
  String get popularPattern;

  Future<List<Object>> getPopularList(Map<String, dynamic> params) async {
    final response =
        await dio.get(endPoint + popularPattern, queryParameters: params);

    if (response.statusCode != 200) {
      throw CommonAPIRequestFailure();
    }
    return toList(response.data);
  }
}

```

### JSON自动转换Dart类
#### Json转换
网络请求来的Json数据可以通过dart:convert包的json方法序列化为`Map<String, dynamic>`格式的数据。进而可以通过编写相关字段的转换生成实体类，官方推荐中大型项目中使用`json_serializable`转换API提供的JSON数据, 能够减少大量重复代码。

- pubspec.yaml
```
dependencies:
  # Your other regular dependencies here
  json_annotation: <latest_version>

dev_dependencies:
  # Your other dev_dependencies here
  build_runner: <latest_version>
  json_serializable: <latest_version>

```

- 根据API编写模版类
```dart
import 'package:json_annotation/json_annotation.dart';

part 'video.g.dart';

@JsonSerializable()
class Video {
  Video(
    this.id,
    this.overview,
    ...
  );

  final int id;
  final String overview;
  ...


  factory Video.fromJson(Map<String, dynamic> json) => _$VideoFromJson(json);

  Map<String, dynamic> toJson() => _$VideoToJson(this);
}
```

- 根目录运行命令自动生成辅助代码
```
flutter pub run build_runner build
```

或者可以开启一个`watcher`监视项目文件并自动编译我们需要的文件
```
 flutter pub run build_runner watch
```

#### 消费自动生成的实体类
```dart
List<Video> parseData(response) {
  final parsed = jsonDecode(response)['data'];
  final videoList = parsed.map<Video>((json) => Video.fromJson(json)).toList();
  return videoList;
}
```
### 测试数据
Flutter Package的模板已自动安装了单元测试所需要的`test`包， 直接修改官方模板的测试示例即可对数据层数据可用性进行测试。
```dart
import 'package:flutter_test/flutter_test.dart';

import 'package:moviedb_api/moviedb_api.dart';

void main() {
  const String _baseUrl = 'http://127.0.0.1:3000';
  late MoviedbAPIClient movieAPI;

  setUpAll(() {
    movieAPI = MoviedbAPIClient(baseUrl: _baseUrl);
  });
  group('api test', () {
    test('popular movie', () async {
      final movies = await movieAPI.getPopularList({'page': 1});
      print(movies);
      expect(movies, isList);
    });

    test('detail', () async {
      final movie = await movieAPI.getDetail('512195');
      print(movie);
      expect(movie, isInstanceOf<Video>());
    });

    test('trailer', () async {
      final trailers = await movieAPI.getVideoTrailer(512195);
      print(trailers);
      expect(trailers, isList);
    });
  });
}
```

## 业务层
业务层基于数据层提供的数据，使用bloc库进行构建，为项目提供增删改查及其他复杂的业务能力。

### Bloc简介
Bloc是一个项目的状态管理框架，与其对应的有Redux，Fish Redux， Redux方案多用于前端技术，而安卓生态中Bloc是首选。

![bloc](https://bloclibrary.dev/assets/bloc_architecture_full.png)

使用Bloc模式可将我们的应用分为3层:
- Presentation 展示层
- Business Logic 业务逻辑层
- Data
  - Repository 数据仓库，组织各种源数据
  - Data Provider 源数据，包括第三方API, 数据库等

### 创建电影列表的Bloc
下面以电影列表数据为例，创建列表数据所需的bloc库。

#### 需求分析
业务需求为默认展示最热门的电影列表，下拉至页面底部会加载下一页的列表数据，直至列表为空；搜索电影功能通过用户传入的搜索关键字查询到相关电影列表，同样支持下拉加载下一页数据。

#### Bloc State
state用于定义需保存的状态的数据的结构，电影列表主要需列表数据，分页信息，及当前状态。

```dart
part of 'list_bloc.dart';

enum Type { popular, search }
enum Status { initial, success, failure }

class ListState<T> extends Equatable {
  const ListState({
    this.status = Status.initial,
    this.type = Type.popular,
    this.items = const [],
    this.hasReachedMax = false, // 是否到达列表末尾项
    this.pageIndex = 0,
    this.searchText = '',
    this.params = const {},
  });

  final Status status;
  final Type type;
  final List<T> items;
  final bool hasReachedMax;
  final int pageIndex;
  final String searchText;
  final Map<String, String> params;

  ListState copyWith({
    Status? status,
    Type? type,
    List<T>? items,
    bool? hasReachedMax,
    int? pageIndex,
    String? searchText,
    Map<String, String>? params,
  }) {
    return ListState(
      status: status ?? this.status,
      type: type ?? this.type,
      items: items ?? this.items,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
      pageIndex: pageIndex ?? this.pageIndex,
      searchText: searchText ?? this.searchText,
      params: params ?? this.params,
    );
  }

  @override
  String toString() {
    return '''VideoState { status: $status, type: $type, hasReachedMax: $hasReachedMax, videos: ${items.length}, pageIndex: $pageIndex, searchText: $searchText }''';
  }

  @override
  List<Object> get props =>
      [status, type, items, hasReachedMax, pageIndex, searchText, params];
}
```
值得注意的是state继承了`Equatable`类用于state间的对比。因为默认dart中`==`操作对比的是hash值，因此属性全部相同两个state的对比操作也会返回false。`Equatable`重写了其`==`运算符，使得具有相同属性的两个state对比能够返回true。

#### Bloc Event
evnet用于定义业务事件，如获取信息，添加收藏，取消收藏等事件。本文示例涉及了热门电影的获取和搜索结果的获取两个事件。
```dart
part of 'list_bloc.dart';

abstract class ListEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class FetchRecommandList extends ListEvent {
  final Map<String, dynamic>? params;

  FetchRecommandList({this.params});
}

class FetchSearchList extends ListEvent {
  final String query;

  FetchSearchList(this.query);
}
```

#### Bloc logic
接下来将状态与事件绑定，定义事件发生时列表状态即列表数据将如何改变，这里引用上文编写的数据层，当接收到获取事件时，向数据层请求列表数据，同时记录当前列表的分页等信息,当`hasReachedMax`为true，即列表到达末尾时则不再请求。

```dart
import 'package:bloc/bloc.dart';
import 'package:bloc_concurrency/bloc_concurrency.dart';
import 'package:equatable/equatable.dart';
import 'package:stream_transform/stream_transform.dart';

import 'package:library_repository/library_repository.dart';

part 'list_event.dart';
part 'list_state.dart';

const throttleDuration = Duration(milliseconds: 100);

EventTransformer<E> throttleDroppable<E>(Duration duration) {
  return (events, mapper) {
    return droppable<E>().call(events.throttle(duration), mapper);
  };
}

class ListBloc extends Bloc<ListEvent, ListState> {
  ListBloc({required LibraryRepository libraryRepository})
      : _libraryRepository = libraryRepository,
        super(const ListState()) {
    on<FetchRecommandList>(_onFetchRecommandList,
        transformer: throttleDroppable(throttleDuration));
    on<FetchSearchList>(_onFetchSearchList,
        transformer: throttleDroppable(throttleDuration));
  }

  final LibraryRepository _libraryRepository;

  Future<void> _onFetchRecommandList(
    FetchRecommandList event,
    Emitter<ListState> emit,
  ) async {
    try {
      if (state.type == Type.search) {
        final items = await _libraryRepository.getPopularList({'page': 1});

        return emit(state.copyWith(
          status: Status.success,
          type: Type.popular,
          items: items,
          hasReachedMax: false,
          pageIndex: 1,
          searchText: '',
        ));
      }

      if (state.hasReachedMax) return;

      final pageIndex = state.pageIndex + 1;
      final params = {
        'page': pageIndex,
      };
      final items = await _libraryRepository.getPopularList(params);

      items.isEmpty
          ? emit(state.copyWith(hasReachedMax: true))
          : emit(state.copyWith(
              status: Status.success,
              type: Type.popular,
              items: List.of(state.items)..addAll(items),
              hasReachedMax: false,
              pageIndex: pageIndex));
    } catch (e) {
      emit(state.copyWith(status: Status.failure));
    }
  }

  Future<void> _onFetchSearchList(
    FetchSearchList event,
    Emitter<ListState> emit,
  ) async {
    try {
      final searchText =
          _libraryRepository.type == APIType.movie ? 'text' : 'query';
      // if search text changed, initial
      if (state.searchText != event.query) {
        final items = await _libraryRepository.getSearchList({
          searchText: event.query,
          'page': 1,
        });

        return emit(state.copyWith(
          status: Status.success,
          type: Type.search,
          items: items,
          hasReachedMax: false,
          pageIndex: 1,
          searchText: event.query,
        ));
      }

      // stop fetch when list is over
      if (state.hasReachedMax) return;

      // fetch next search page
      final index = state.pageIndex + 1;
      final items = await _libraryRepository
          .getSearchList({searchText: event.query, 'page': index});

      items.isEmpty
          ? emit(state.copyWith(hasReachedMax: true))
          : emit(state.copyWith(
              status: Status.success,
              type: Type.search,
              items: List.of(state.items)..addAll(items),
              pageIndex: index,
            ));
    } catch (e) {
      emit(state.copyWith(status: Status.failure));
    }
  }
}
```
这里应用了bloc的`transformer`功能对event进行处理，定义`throttleDroppable`节流操作防止长列表滚动时多次请求下一页。

以上列表的Bloc便定义完成，可以在UI层进行列表数据的消费。

## UI层
### Bloc消费
Bloc数据的消费包括`BlocProvider`和`BlocBuilder`两个组件。  
`BlocProvider`能够以`BlocProvider.of<T>(context)`的方式向其子组件提供bloc，其原理是通过依赖注入(dependency injection)的方式实现因此能够将一个bloc提供给同一组件树下的多个子widget。  
`BlocBuilder`同`StreamBuilder`类似，根据new state处理组件的构建.
```dart
class VideoListPage extends StatelessWidget {
  const VideoListPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ListBloc(
        libraryRepository:
            LibraryRepository(baseUrl: backendURI, type: APIType.movie),
      )..add(FetchRecommandList()), // 初始化时请求第一页电影列表数据
      child: Scaffold(
        body: BlocBuilder<ListBloc, ListState>(builder: (context, state) {
          final items = context.read<ListBloc>().state.items;
          return VideoLibrary(
            items: items,
          );
        }),
      ),
    );
  }
}
```

### 抽象通用组件
无限滚动长列表一般包含搜索框，滚动事件，列表组件，卡片等内容，Flutter默认提供GridView组件，但数据，滚动到底部的数据请求均需要自行处理，因此封装一套组件，提供带搜索框的长列表组件。

#### 列表组件
重点在滚动事件的处理，与搜索表单的联动，直接上代码：
```dart
import 'package:flutter/material.dart';

class CommonList extends StatefulWidget {
  const CommonList({
    Key? key,
    required this.items,
    required this.fetchRecommandList,
    required this.fetchSearchList,
    required this.cardBuilder,
    this.showSearchForm = true,
    this.color = const Color(0xFF3F3F3F),
    this.aspectRatio = 0.55,
  });

  final List<dynamic> items;
  final VoidCallback fetchRecommandList;
  final void Function(String searchText) fetchSearchList;
  final Widget Function(BuildContext context, int index) cardBuilder;
  final bool showSearchForm;
  final Color color;
  final double aspectRatio;

  @override
  _CommonListState createState() => _CommonListState();
}

class _CommonListState extends State<CommonList> {
  late ScrollController _scrollController;
  String searchText = '';

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController()..addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    super.dispose();
  }

  void _scrollListener() {
    if (_isBottom) {
      /// search text is null, fetch popular movies
      /// isn't null, fetch search items
      if (searchText == '') {
        widget.fetchRecommandList();
      } else {
        widget.fetchSearchList(searchText);
      }
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    return currentScroll >= (maxScroll * 0.9);
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: Duration(milliseconds: 500),
      curve: Curves.ease,
    );
  }

  void _onSearchCallback(String? query) {
    setState(() {
      searchText = query!;
    });
    if (query == '') {
      widget.fetchRecommandList();
    } else {
      widget.fetchSearchList(query!);
    }
    _scrollToTop();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        widget.showSearchForm
            ? CommonSearch(
                color: widget.color,
                searchCallback: _onSearchCallback,
              )
            : SizedBox(
                height: 10,
              ),
        Expanded(
          child: GridView.builder(
            padding: EdgeInsets.symmetric(vertical: 4.0, horizontal: 12.0),
            controller: _scrollController,
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 20.0,
              mainAxisSpacing: 20.0,
              childAspectRatio: widget.aspectRatio,
            ),
            itemCount: widget.items.length,
            itemBuilder: (BuildContext context, int index) {
              return widget.cardBuilder(context, index);
            },
          ),
        ),
      ],
    );
  }
}

class CommonSearch extends StatefulWidget {
  const CommonSearch(
      {Key? key, required this.color, required this.searchCallback})
      : super(key: key);

  final Function(String?) searchCallback;
  final Color color;

  @override
  State<CommonSearch> createState() => _CommonSearchState();
}

class _CommonSearchState extends State<CommonSearch> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(12.0, 6.0, 12.0, 16.0),
      child: Form(
        key: _formKey,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            Expanded(
              child: TextFormField(
                cursorColor: Colors.white,
                style: TextStyle(color: Color(0xff9ca3af), fontSize: 14.0),
                decoration: InputDecoration(
                  hintText: '请输入搜索内容',
                  hintStyle:
                      TextStyle(color: Color(0xff9ca3af), fontSize: 14.0),
                  border: OutlineInputBorder(
                      borderSide: BorderSide.none,
                      borderRadius:
                          const BorderRadius.all(Radius.circular(16))),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide.none,
                    borderRadius: const BorderRadius.all(Radius.circular(16)),
                  ),
                  filled: true,
                  fillColor: widget.color,
                  contentPadding: EdgeInsets.symmetric(horizontal: 16.0),
                  prefixIcon: Icon(
                    Icons.search,
                    color: Color(0xffe5e7eb),
                  ),
                ),
                onSaved: (String? value) {
                  widget.searchCallback(value);
                },
                onEditingComplete: () {
                  _formKey.currentState!.save();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

```

#### 卡片组件
使用CachedNetworkImage组件代替官方的图片组件，不仅提供优秀的缓存性能，同时`placeholder`属性也提供了优秀的渐变动画效果。
```dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CommonCard extends StatelessWidget {
  const CommonCard({
    Key? key,
    required this.name,
    required this.imagePath,
    this.aspect = 1.0,
    this.onClick,
    this.textColor = Colors.white,
  }) : super(key: key);

  final String name;
  final String imagePath;
  final void Function()? onClick;
  final num aspect;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    final cardWidth = MediaQuery.of(context).size.width / 3.2;
    final cardHeight = MediaQuery.of(context).size.width / 3.2 * aspect;

    return GestureDetector(
      onTap: onClick,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Hero(
            tag: imagePath,
            child: ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: CachedNetworkImage(
                  imageUrl: imagePath,
                  width: cardWidth,
                  height: cardHeight,
                  fit: BoxFit.cover,
                  alignment: Alignment.centerLeft,
                  placeholder: (context, url) => Container(
                    width: cardWidth,
                    height: cardHeight,
                    color: Colors.grey[300],
                  ),
                  errorWidget: (context, url, error) => Container(
                    width: cardWidth,
                    height: cardHeight,
                    color: Colors.red[100],
                  ),
                )),
          ),
          SizedBox(
            height: 6.0,
          ),
          Text(
            name,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.left,
            style: TextStyle(
              color: textColor,
              fontSize: 12.0,
            ),
          ),
        ],
      ),
    );
  }
}
```

#### 通用组件使用
使用上文配置的通用长列表组件，用过简单配置即可实现文章开头处的效果。
```dart
CommonList(
  items: items,
  fetchRecommandList: () {
    context.read<ListBloc>().add(FetchRecommandList());
  },
  fetchSearchList: (searchText) {
    context.read<ListBloc>().add(FetchSearchList(searchText));
  },
  cardBuilder: (context, index) {
    return CommonCard(
      name: items[index].title,
      imagePath: items[index].posterPath,
      aspect: 1.3,
      onClick: () {
        Navigator.of(context).pushNamed(routes.detailRoute,
            arguments: routes.DetailArguments(
              items[index].id,
              items[index].posterPath,
            ));
      },
    );
  },
),
```

## 结语
本文是笔者自学flutter搭建一个练手项目。基于Flutter框架，使用Bloc模式构建了一个具有分层架构的电影app。由于涉及的知识点较多，笔者只挑取要点的概念和代码进行了介绍，完整代码已放入[Github](https://github.com/SunsetFrost/Flutter-MediaLibrary),欢迎star～