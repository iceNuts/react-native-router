'use strict';

var React = require('react-native');

var NavBarContainer = require('./components/NavBarContainer');
var BackButtonAction = require('./binding/back-button-action');
var BackButtonStore = require('./binding/back-button-store');

var {
  StyleSheet,
  Navigator,
  StatusBarIOS,
  View,
} = React;

var _onBackData;

var Router = React.createClass({

  getInitialState: function() {
    return {
      route: {
        name: null,
        index: null,
        tag: null
      },
      dragStartX: null,
      didSwitchView: null,
    }
  },

  onWillFocus: function(route) {
    this.setState({ route: route });
  },

  setOnBackData: function(data) {
    _onBackData = data;
  },

  addOnBackListener: function(callback) {
    BackButtonStore.addOnBackListener(callback);
  },

  removeOnBackListener: function(callback) {
    BackButtonStore.removeOnBackListener(callback)
  },

  getDataOnBack: function() {
    return BackButtonStore.getDataOnBack();
  },

  onBack: function(navigator) {
    if (this.state.route.index > 0) {
      BackButtonAction.onBack(_onBackData);
      navigator.pop();
    }
  },

  onForward: function(route, navigator) {
    route.index = this.state.route.index + 1 || 1;
    navigator.push(route);
  },

  customAction: function(opts) {
    this.props.customAction(opts);
  },

  renderScene: function(route, navigator) {

    var goForward = function(route) {
      route.index = this.state.route.index + 1 || 1;
      navigator.push(route);
    }.bind(this);

    var goBackwards = function() {
      this.onBack(navigator);
    }.bind(this);

    var customAction = function(opts) {
      this.customAction(opts);
    }.bind(this);

    var addOnBackListener = function(callback) {
      this.addOnBackListener(callback);
    }.bind(this);

    var removeOnBackListener = function(callback) {
      this.removeOnBackListener(callback);
    }.bind(this);

    var getDataOnBack = function() {
      return this.getDataOnBack();
    }.bind(this);

    var setOnBackData = function(data) {
      this.setOnBackData({
          data: data,
          source: route.tag
        });
    }.bind(this);

    var didStartDrag = function(evt) {
      var x = evt.nativeEvent.pageX;
      if (x < 28) {
        this.setState({ 
          dragStartX: x, 
          didSwitchView: false
        });
        return true;
      }
    }.bind(this);

    // Recognize swipe back gesture for navigation
    var didMoveFinger = function(evt) {
      var draggedAway = ((evt.nativeEvent.pageX - this.state.dragStartX) > 30);
      if (!this.state.didSwitchView && draggedAway) {
        this.onBack(navigator);
        this.setState({ didSwitchView: true });
      }
    }.bind(this);

    // Set to false to prevent iOS from hijacking the responder
    var preventDefault = function(evt) {
      return true;
    };

    var Content = route.component;
    
    return (
      <View
        style={[styles.container, this.props.bgStyle]}
        onStartShouldSetResponder={didStartDrag}
        onResponderMove={didMoveFinger}
        onResponderTerminationRequest={preventDefault}>
        <Content
          name={route.name}
          index={route.index}
          data={route.data}
          tag={route.tag}
          toRoute={goForward}
          toBack={goBackwards}
          getDataOnBack={getDataOnBack}
          addOnBackListener={addOnBackListener}
          removeOnBackListener={removeOnBackListener}
          setOnBackData={setOnBackData}
          customAction={customAction}
        />
      </View>
    )
    
  },

  render: function() {

    StatusBarIOS.setStyle(1);

    return (
      <Navigator
        initialRoute={this.props.firstRoute}
        navigationBar={
          <NavBarContainer
            style={this.props.headerStyle}
            navigator={navigator} 
            currentRoute={this.state.route}
            backButtonComponent={this.props.backButtonComponent}
            rightCorner={this.props.rightCorner}
            titleStyle={this.props.titleStyle}
            toRoute={this.onForward}
            getDataOnBack={this.getDataOnBack}
            addOnBackListener={this.addOnBackListener}
            removeOnBackListener={this.removeOnBackListener}
            setOnBackData={this.setOnBackData}
            toBack={this.onBack}
            customAction={this.customAction}
          />
        }
        renderScene={this.renderScene}
        onWillFocus={this.onWillFocus}
      />
    )
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 64
  },
});


module.exports = Router;
