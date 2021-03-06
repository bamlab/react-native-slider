'use strict';var _jsxFileName="src/Slider.js";var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};

var _react=require("react");var _react2=_interopRequireDefault(_react);




var _reactNative=require("react-native");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}









var shallowCompare=require('react-addons-shallow-compare'),
styleEqual=require('style-equal');

var TRACK_SIZE=4;
var THUMB_SIZE=20;
var GRADUATION_HEIGHT=10;
var GRADUATION_WIDTH=3;
var GRADUATION_LABEL_OFFSET=-37;

function Rect(x,y,width,height){
this.x=x;
this.y=y;
this.width=width;
this.height=height;
}

Rect.prototype.containsPoint=function(x,y){
return x>=this.x&&
y>=this.y&&
x<=this.x+this.width&&
y<=this.y+this.height;
};

var DEFAULT_ANIMATION_CONFIGS={
spring:{
friction:7,
tension:100},

timing:{
duration:150,
easing:_reactNative.Easing.inOut(_reactNative.Easing.ease),
delay:0}};







var Slider=_react2.default.createClass({displayName:"Slider",
propTypes:{
/**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
value:_react.PropTypes.number,

/**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
disabled:_react.PropTypes.bool,

/**
     * If true, touching the slider will directly move the thumb to the
     * touched position
     * WARNING : Only works if the slider is centered on the screen
     * Default value is false
     */
enableDirectTouch:_react.PropTypes.bool,

/**
     * Initial minimum value of the slider. Default value is 0.
     */
minimumValue:_react.PropTypes.number,

/**
     * Initial maximum value of the slider. Default value is 1.
     */
maximumValue:_react.PropTypes.number,

/**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
step:_react.PropTypes.number,

/**
     * Graduation value of the slider to display a reguliar vertical tick.
     * The value should be between 0 and (maximumValue - minimumValue).
     * Default value is 0
     */
graduation:_react.PropTypes.number,

/**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
minimumTrackTintColor:_react.PropTypes.string,

/**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
maximumTrackTintColor:_react.PropTypes.string,

/**
     * The color used for the thumb.
     */
thumbTintColor:_react.PropTypes.string,

/**
     * The function which given the graduation index returns the wanted label
     * placed above.
     */
graduationLabel:_react.PropTypes.func,

/**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
thumbTouchSize:_react.PropTypes.shape(
{width:_react.PropTypes.number,height:_react.PropTypes.number}),


/**
     * Callback continuously called while the user is dragging the slider.
     */
onValueChange:_react.PropTypes.func,

/**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
onSlidingStart:_react.PropTypes.func,

/**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
onSlidingComplete:_react.PropTypes.func,

/**
     * The style applied to the slider container.
     */
style:_reactNative.View.propTypes.style,

/**
     * The style applied to the track.
     */
trackStyle:_reactNative.View.propTypes.style,

/**
     * The style applied to the thumb.
     */
thumbStyle:_reactNative.View.propTypes.style,

/**
     * The style applied to the graduation.
     */
graduationStyle:_reactNative.View.propTypes.style,

/**
     * Set this to true to visually see the thumb touch rect in green.
     */
debugTouchArea:_react.PropTypes.bool,

/**
    * Set to true to animate values with default 'timing' animation type
    */
animateTransitions:_react.PropTypes.bool,

/**
    * Custom Animation type. 'spring' or 'timing'.
    */
animationType:_react.PropTypes.oneOf(['spring','timing']),

/**
    * Used to configure the animation parameters.  These are the same parameters in the Animated library.
    */
animationConfig:_react.PropTypes.object},

getInitialState:function getInitialState(){var _props=




this.props;var graduation=_props.graduation;var maximumValue=_props.maximumValue;var minimumValue=_props.minimumValue;

var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;

// We provide an initial legend width big enough (150) to contain usual texts
// to be provided above the graduation marks
return{
containerSize:{width:0,height:0},
trackSize:{width:0,height:0},
thumbSize:{width:0,height:0},
legendWidth:Array.from(new Array(numberOfGraduations),function(){return 150;}),
allMeasured:false,
value:new _reactNative.Animated.Value(this.props.value)};

},
getDefaultProps:function getDefaultProps(){
return{
value:0,
minimumValue:0,
maximumValue:1,
step:0,
graduation:0,
minimumTrackTintColor:'#3f3f3f',
maximumTrackTintColor:'#b3b3b3',
thumbTintColor:'#343434',
thumbTouchSize:{width:40,height:40},
debugTouchArea:false,
animationType:'timing'};

},
componentWillMount:function componentWillMount(){
this._panResponder=_reactNative.PanResponder.create({
onStartShouldSetPanResponder:this._handleStartShouldSetPanResponder,
onMoveShouldSetPanResponder:this._handleMoveShouldSetPanResponder,
onPanResponderGrant:this._handlePanResponderGrant,
onPanResponderStart:this._handlePanResponderStart,
onPanResponderMove:this._handlePanResponderMove,
onPanResponderRelease:this._handlePanResponderEnd,
onPanResponderTerminationRequest:this._handlePanResponderRequestEnd,
onPanResponderTerminate:this._handlePanResponderEnd});

},
componentWillReceiveProps:function componentWillReceiveProps(nextProps){
var newValue=nextProps.value;
if(this._getCurrentValue()!==newValue){
if(this.props.animateTransitions){
this._setCurrentValueAnimated(newValue);
}else
{
this._setCurrentValue(newValue);
}
}
},
shouldComponentUpdate:function shouldComponentUpdate(nextProps,nextState){
// We don't want to re-render in the following cases:
// - when only the 'value' prop changes as it's already handled with the Animated.Value
// - when the event handlers change (rendering doesn't depend on them)
// - when the style props haven't actually change
return shallowCompare(
{props:this._getPropsForComponentUpdate(this.props),state:this.state},
this._getPropsForComponentUpdate(nextProps),
nextState)||
!styleEqual(this.props.style,nextProps.style)||
!styleEqual(this.props.trackStyle,nextProps.trackStyle)||
!styleEqual(this.props.thumbStyle,nextProps.thumbStyle)||
!styleEqual(this.props.graduationStyle,nextProps.graduationStyle);
},
render:function render(){var _this=this;var _props2=














this.props;var graduation=_props2.graduation;var minimumValue=_props2.minimumValue;var maximumValue=_props2.maximumValue;var minimumTrackTintColor=_props2.minimumTrackTintColor;var maximumTrackTintColor=_props2.maximumTrackTintColor;var thumbTintColor=_props2.thumbTintColor;var styles=_props2.styles;var style=_props2.style;var trackStyle=_props2.trackStyle;var thumbStyle=_props2.thumbStyle;var graduationStyle=_props2.graduationStyle;var debugTouchArea=_props2.debugTouchArea;var other=_objectWithoutProperties(_props2,["graduation","minimumValue","maximumValue","minimumTrackTintColor","maximumTrackTintColor","thumbTintColor","styles","style","trackStyle","thumbStyle","graduationStyle","debugTouchArea"]);var _state=
this.state;var value=_state.value;var containerSize=_state.containerSize;var trackSize=_state.trackSize;var thumbSize=_state.thumbSize;var allMeasured=_state.allMeasured;
var mainStyles=styles||defaultStyles;
var thumbLeft=value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:[0,containerSize.width-thumbSize.width]});


var valueVisibleStyle={};
if(!allMeasured){
valueVisibleStyle.opacity=0;
}

var minimumTrackStyle=_extends({
position:'absolute',
width:_reactNative.Animated.add(thumbLeft,thumbSize.width/2),
marginTop:-trackSize.height,
backgroundColor:minimumTrackTintColor},
valueVisibleStyle);


var touchOverflowStyle=this._getTouchOverflowStyle();

var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;

return(
_react2.default.createElement(_reactNative.View,_extends({},other,{style:[mainStyles.container,style],onLayout:this._measureContainer,__source:{fileName:_jsxFileName,lineNumber:310}}),
_react2.default.createElement(_reactNative.View,{
style:[{backgroundColor:maximumTrackTintColor},mainStyles.track,trackStyle],
onLayout:this._measureTrack,__source:{fileName:_jsxFileName,lineNumber:311}}),
_react2.default.createElement(_reactNative.Animated.View,{style:[mainStyles.track,trackStyle,minimumTrackStyle],__source:{fileName:_jsxFileName,lineNumber:314}}),
[].concat(_toConsumableArray(Array(numberOfGraduations))).map(function(x,i){return(
_react2.default.createElement(_reactNative.View,{key:i,__source:{fileName:_jsxFileName,lineNumber:316}},
_react2.default.createElement(_reactNative.View,{
style:[
{backgroundColor:maximumTrackTintColor,marginTop:-(trackSize.height+GRADUATION_HEIGHT)/2},
mainStyles.graduation,graduationStyle,_extends({left:_this._getGraduationOffset(i)},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:317}}),

_react2.default.createElement(_reactNative.Animated.View,{
onLayout:function onLayout(event){return _this._measureLegend(event,i);},
style:[mainStyles.graduationLabel,
{width:_this.state.legendWidth[i],left:_this._getGraduationOffset(i)-_this.state.legendWidth[i]/2}],__source:{fileName:_jsxFileName,lineNumber:322}},
_this._renderGraduationLabel(i))));}),



_react2.default.createElement(_reactNative.Animated.View,{
onLayout:this._measureThumb,
style:[
{backgroundColor:thumbTintColor,marginTop:-(trackSize.height+thumbSize.height)/2},
mainStyles.thumb,thumbStyle,_extends({left:thumbLeft},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:330}}),


_react2.default.createElement(_reactNative.View,_extends({
style:[defaultStyles.touchArea,touchOverflowStyle]},
this._panResponder.panHandlers,{__source:{fileName:_jsxFileName,lineNumber:337}}),
debugTouchArea===true&&this._renderDebugThumbTouchRect(thumbLeft))));



},

_getPropsForComponentUpdate:function _getPropsForComponentUpdate(props){var

value=








props.value;var onValueChange=props.onValueChange;var onSlidingStart=props.onSlidingStart;var onSlidingComplete=props.onSlidingComplete;var style=props.style;var trackStyle=props.trackStyle;var thumbStyle=props.thumbStyle;var graduationStyle=props.graduationStyle;var otherProps=_objectWithoutProperties(props,["value","onValueChange","onSlidingStart","onSlidingComplete","style","trackStyle","thumbStyle","graduationStyle"]);

return otherProps;
},

_getGraduationOffset:function _getGraduationOffset(index){var _props3=





this.props;var graduation=_props3.graduation;var thumbStyle=_props3.thumbStyle;var minimumValue=_props3.minimumValue;var maximumValue=_props3.maximumValue;var _state2=



this.state;var containerSize=_state2.containerSize;var thumbSize=_state2.thumbSize;

var graduationOffset=thumbSize.height/2;

graduationOffset+=(minimumValue+graduation*index)*(containerSize.width-thumbSize.width)/maximumValue;

if(thumbStyle.borderWidth){
graduationOffset-=2*thumbStyle.borderWidth;
}

return graduationOffset;
},

_handleStartShouldSetPanResponder:function _handleStartShouldSetPanResponder(e){
// Should we become active when the user presses down on the thumb?
this.setState({
moving:this._thumbHitTest(e)});

return true;
},

_handleMoveShouldSetPanResponder:function _handleMoveShouldSetPanResponder(){
// Should we become active when the user moves a touch over the thumb?
return false;
},

_handlePanResponderGrant:function _handlePanResponderGrant(e,gestureState){
this._previousLeft=this._getThumbLeft(this._getCurrentValue());
this._fireChangeEvent('onSlidingStart');
},
_handlePanResponderStart:function _handlePanResponderStart(e,gestureState){
if(this._thumbHitTest(e)||!this.props.enableDirectTouch){
return;
}

this._setCurrentValue(this._getValue(gestureState,false));
this._fireChangeEvent('onValueChange');
this._fireChangeEvent('onSlidingComplete');
},
_handlePanResponderMove:function _handlePanResponderMove(e,gestureState){
if(this.props.disabled||!this.state.moving){
return;
}

this._setCurrentValue(this._getValue(gestureState,true));
this._fireChangeEvent('onValueChange');
},
_handlePanResponderRequestEnd:function _handlePanResponderRequestEnd(e,gestureState){
// Should we allow another component to take over this pan?
return false;
},
_handlePanResponderEnd:function _handlePanResponderEnd(e,gestureState){
this.setState({
moving:false});

if(this.props.disabled){
return;
}

this._fireChangeEvent('onSlidingComplete');
},

_measureContainer:function _measureContainer(x){
this._handleMeasure('containerSize',x);
},

_measureTrack:function _measureTrack(x){
this._handleMeasure('trackSize',x);
},

_measureThumb:function _measureThumb(x){
this._handleMeasure('thumbSize',x);
},

_measureLegend:function _measureLegend(x,index){
var legendWidth=this.state.legendWidth;
legendWidth[index]=x.nativeEvent.layout.width;
this.setState({legendWidth:legendWidth});
},

_handleMeasure:function _handleMeasure(name,x){var _x$nativeEvent$layout=
x.nativeEvent.layout;var width=_x$nativeEvent$layout.width;var height=_x$nativeEvent$layout.height;
var size={width:width,height:height};

var storeName="_"+name;
var currentSize=this[storeName];
if(currentSize&&width===currentSize.width&&height===currentSize.height){
return;
}
this[storeName]=size;

if(this._containerSize&&this._trackSize&&this._thumbSize){
this.setState({
containerSize:this._containerSize,
trackSize:this._trackSize,
thumbSize:this._thumbSize,
allMeasured:true});

}
},

_getRatio:function _getRatio(value){
return(value-this.props.minimumValue)/(this.props.maximumValue-this.props.minimumValue);
},

_getThumbLeft:function _getThumbLeft(value){
var ratio=this._getRatio(value);
return ratio*(this.state.containerSize.width-this.state.thumbSize.width);
},

_getValue:function _getValue(gestureState,move){
var length=this.state.containerSize.width-this.state.thumbSize.width;
var thumbLeft;
if(move){
thumbLeft=this._previousLeft+gestureState.dx;
}else{
var offset=(_reactNative.Dimensions.get('window').width-length)/2;
thumbLeft=gestureState.x0-offset;
}

var ratio=thumbLeft/length;

if(this.props.step){
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
this.props.minimumValue+Math.round(ratio*(this.props.maximumValue-this.props.minimumValue)/this.props.step)*this.props.step));


}else{
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
ratio*(this.props.maximumValue-this.props.minimumValue)+this.props.minimumValue));


}
},

_getCurrentValue:function _getCurrentValue(){
return this.state.value.__getValue();
},

_setCurrentValue:function _setCurrentValue(value){
this.state.value.setValue(value);
},

_setCurrentValueAnimated:function _setCurrentValueAnimated(value){
var animationType=this.props.animationType;
var animationConfig=_extends(
{},
DEFAULT_ANIMATION_CONFIGS[animationType],
this.props.animationConfig,
{toValue:value});


_reactNative.Animated[animationType](this.state.value,animationConfig).start();
},

_fireChangeEvent:function _fireChangeEvent(event){
if(this.props[event]){
this.props[event](this._getCurrentValue());
}
},

_getTouchOverflowSize:function _getTouchOverflowSize(){
var state=this.state;
var props=this.props;

var size={};
if(state.allMeasured===true){
size.width=Math.max(0,props.thumbTouchSize.width-state.thumbSize.width);
size.height=Math.max(0,props.thumbTouchSize.height-state.containerSize.height);
}

return size;
},

_getTouchOverflowStyle:function _getTouchOverflowStyle(){var _getTouchOverflowSize2=
this._getTouchOverflowSize();var width=_getTouchOverflowSize2.width;var height=_getTouchOverflowSize2.height;

var touchOverflowStyle={};
if(width!==undefined&&height!==undefined){
var verticalMargin=-height/2;
touchOverflowStyle.marginTop=verticalMargin;
touchOverflowStyle.marginBottom=verticalMargin;

var horizontalMargin=-width/2;
touchOverflowStyle.marginLeft=horizontalMargin;
touchOverflowStyle.marginRight=horizontalMargin;
}

if(this.props.debugTouchArea===true){
touchOverflowStyle.backgroundColor='orange';
touchOverflowStyle.opacity=0.5;
}

return touchOverflowStyle;
},

_thumbHitTest:function _thumbHitTest(e){
var nativeEvent=e.nativeEvent;
var thumbTouchRect=this._getThumbTouchRect();
return thumbTouchRect.containsPoint(nativeEvent.locationX,nativeEvent.locationY);
},

_getThumbTouchRect:function _getThumbTouchRect(){
var state=this.state;
var props=this.props;
var touchOverflowSize=this._getTouchOverflowSize();

return new Rect(
touchOverflowSize.width/2+this._getThumbLeft(this._getCurrentValue())+(state.thumbSize.width-props.thumbTouchSize.width)/2,
touchOverflowSize.height/2+(state.containerSize.height-props.thumbTouchSize.height)/2,
props.thumbTouchSize.width,
props.thumbTouchSize.height);

},

_renderGraduationLabel:function _renderGraduationLabel(index){
if(this.props.graduationLabel){
return(
_react2.default.createElement(_reactNative.Text,{style:{textAlign:'center'},__source:{fileName:_jsxFileName,lineNumber:592}},
this.props.graduationLabel(index)));


}
return _react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:597}});
},

_renderDebugThumbTouchRect:function _renderDebugThumbTouchRect(thumbLeft){
var thumbTouchRect=this._getThumbTouchRect();
var positionStyle={
left:thumbLeft,
top:thumbTouchRect.y,
width:thumbTouchRect.width,
height:thumbTouchRect.height};


return(
_react2.default.createElement(_reactNative.Animated.View,{
style:[defaultStyles.debugThumbTouchArea,positionStyle],
pointerEvents:"none",__source:{fileName:_jsxFileName,lineNumber:610}}));


}});



var defaultStyles=_reactNative.StyleSheet.create({
container:{
height:40,
justifyContent:'center'},

track:{
height:TRACK_SIZE,
borderRadius:TRACK_SIZE/2,
marginLeft:THUMB_SIZE/2,
marginRight:THUMB_SIZE/2},

thumb:{
position:'absolute',
width:THUMB_SIZE,
height:THUMB_SIZE,
borderRadius:THUMB_SIZE/2},

graduation:{
position:'absolute',
height:GRADUATION_HEIGHT,
width:GRADUATION_WIDTH},

graduationLabel:{
position:'absolute',
top:GRADUATION_LABEL_OFFSET,
backgroundColor:'transparent'},

touchArea:{
position:'absolute',
backgroundColor:'transparent',
top:0,
left:0,
right:0,
bottom:0},

debugThumbTouchArea:{
position:'absolute',
backgroundColor:'green',
opacity:0.5}});



module.exports=Slider;