/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2010 by CoderBlog, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiUIiOSProxy.h"
#import "TiUtils.h"
#import "Webcolor.h"

#ifdef USE_TI_UIIOS
 
#ifdef USE_TI_UIIOSADVIEW
	#import "TiUIiOSAdViewProxy.h"
    #import <iAd/iAd.h>
#endif

#ifdef USE_TI_UIIOS3DMATRIX
	#import "Ti3DMatrix.h"
#endif
#ifdef USE_TI_UIIOSCOVERFLOWVIEW
	#import "TiUIiOSCoverFlowViewProxy.h"
#endif
#ifdef USE_TI_UIIOSTOOLBAR
	#import "TiUIiOSToolbarProxy.h"
#endif
#ifdef USE_TI_UIIOSTABBEDBAR
	#import "TiUIiOSTabbedBarProxy.h"
#endif

@implementation TiUIiOSProxy

#ifdef USE_TI_UIIOSADVIEW

-(NSString*)AD_SIZE_PORTRAIT 
{
    return [TiUIiOSAdViewProxy portraitSize];
}

-(NSString*)AD_SIZE_LANDSCAPE 
{
    return [TiUIiOSAdViewProxy landscapeSize];
}

-(id)createAdView:(id)args
{
	return [[[TiUIiOSAdViewProxy alloc] _initWithPageContext:[self executionContext] args:args] autorelease];
}

#endif

#ifdef USE_TI_UIIOS3DMATRIX
-(id)create3DMatrix:(id)args
{
	DEPRECATED_REPLACED(@"UI.iOS.create3DMatrix()", @"2.1.0", @"Ti.UI.create3DMatrix()");
    if (args==nil || [args count] == 0)
	{
		return [[[Ti3DMatrix alloc] init] autorelease];
	}
	ENSURE_SINGLE_ARG(args,NSDictionary);
	Ti3DMatrix *matrix = [[Ti3DMatrix alloc] initWithProperties:args];
	return [matrix autorelease];
}
#endif
#ifdef USE_TI_UIIOSCOVERFLOWVIEW
-(id)createCoverFlowView:(id)args
{
	return [[[TiUIiOSCoverFlowViewProxy alloc] _initWithPageContext:[self executionContext] args:args] autorelease];
}
#endif
#ifdef USE_TI_UIIOSTOOLBAR
-(id)createToolbar:(id)args
{
	return [[[TiUIiOSToolbarProxy alloc] _initWithPageContext:[self executionContext] args:args] autorelease];
}
#endif

#ifdef USE_TI_UIIOSTABBEDBAR
-(id)createTabbedBar:(id)args
{
    return [[[TiUIiOSTabbedBarProxy alloc] _initWithPageContext:[self executionContext] args:args] autorelease];
}
#endif
#ifdef USE_TI_UIIOS
MAKE_SYSTEM_PROP_DEPRECATED_REPLACED(ANIMATION_CURVE_EASE_IN_OUT, UIViewAnimationCurveEaseInOut, @"UI.iOS.ANIMATION_CURVE_EASE_IN_OUT", @"2.1.0", @"Ti.UI.ANIMATION_CURVE_EASE_IN_OUT");
MAKE_SYSTEM_PROP_DEPRECATED_REPLACED(ANIMATION_CURVE_EASE_IN, UIViewAnimationCurveEaseIn, @"UI.iOS.ANIMATION_CURVE_EASE_IN", @"2.1.0", @"Ti.UI.ANIMATION_CURVE_EASE_IN");
MAKE_SYSTEM_PROP_DEPRECATED_REPLACED(ANIMATION_CURVE_EASE_OUT,UIViewAnimationCurveEaseOut,  @"UI.iOS.ANIMATION_CURVE_EASE_OUT", @"2.1.0", @"Ti.UI.ANIMATION_CURVE_EASE_OUT");
MAKE_SYSTEM_PROP_DEPRECATED_REPLACED(ANIMATION_CURVE_LINEAR,UIViewAnimationCurveLinear, @"UI.iOS.ANIMATION_CURVE_LINEAR", @"2.1.0", @"Ti.UI.ANIMATION_CURVE_LINEAR");

MAKE_SYSTEM_PROP(BLEND_MODE_NORMAL,kCGBlendModeNormal);
MAKE_SYSTEM_PROP(BLEND_MODE_MULTIPLY,kCGBlendModeMultiply);
MAKE_SYSTEM_PROP(BLEND_MODE_SCREEN,kCGBlendModeScreen);
MAKE_SYSTEM_PROP(BLEND_MODE_OVERLAY,kCGBlendModeOverlay);
MAKE_SYSTEM_PROP(BLEND_MODE_DARKEN,kCGBlendModeDarken);
MAKE_SYSTEM_PROP(BLEND_MODE_LIGHTEN,kCGBlendModeLighten);
MAKE_SYSTEM_PROP(BLEND_MODE_COLOR_DODGE,kCGBlendModeColorDodge);
MAKE_SYSTEM_PROP(BLEND_MODE_COLOR_BURN,kCGBlendModeColorBurn);
MAKE_SYSTEM_PROP(BLEND_MODE_SOFT_LIGHT,kCGBlendModeSoftLight);
MAKE_SYSTEM_PROP(BLEND_MODE_HARD_LIGHT,kCGBlendModeHardLight);
MAKE_SYSTEM_PROP(BLEND_MODE_DIFFERENCE,kCGBlendModeDifference);
MAKE_SYSTEM_PROP(BLEND_MODE_EXCLUSION,kCGBlendModeExclusion);
MAKE_SYSTEM_PROP(BLEND_MODE_HUE,kCGBlendModeHue);
MAKE_SYSTEM_PROP(BLEND_MODE_SATURATION,kCGBlendModeSaturation);
MAKE_SYSTEM_PROP(BLEND_MODE_COLOR,kCGBlendModeColor);
MAKE_SYSTEM_PROP(BLEND_MODE_LUMINOSITY,kCGBlendModeLuminosity);
MAKE_SYSTEM_PROP(BLEND_MODE_CLEAR,kCGBlendModeClear);
MAKE_SYSTEM_PROP(BLEND_MODE_COPY,kCGBlendModeCopy);
MAKE_SYSTEM_PROP(BLEND_MODE_SOURCE_IN,kCGBlendModeSourceIn);
MAKE_SYSTEM_PROP(BLEND_MODE_SOURCE_OUT,kCGBlendModeSourceOut);
MAKE_SYSTEM_PROP(BLEND_MODE_SOURCE_ATOP,kCGBlendModeSourceAtop);
MAKE_SYSTEM_PROP(BLEND_MODE_DESTINATION_OVER,kCGBlendModeDestinationOver);
MAKE_SYSTEM_PROP(BLEND_MODE_DESTINATION_IN,kCGBlendModeDestinationIn);
MAKE_SYSTEM_PROP(BLEND_MODE_DESTINATION_OUT,kCGBlendModeDestinationOut);
MAKE_SYSTEM_PROP(BLEND_MODE_DESTINATION_ATOP,kCGBlendModeDestinationAtop);
MAKE_SYSTEM_PROP(BLEND_MODE_XOR,kCGBlendModeXOR);
MAKE_SYSTEM_PROP(BLEND_MODE_PLUS_DARKER,kCGBlendModePlusDarker);
MAKE_SYSTEM_PROP(BLEND_MODE_PLUS_LIGHTER,kCGBlendModePlusLighter);

MAKE_SYSTEM_PROP(AUTODETECT_NONE,UIDataDetectorTypeNone);
MAKE_SYSTEM_PROP(AUTODETECT_ALL,UIDataDetectorTypeAll);
MAKE_SYSTEM_PROP(AUTODETECT_PHONE,UIDataDetectorTypePhoneNumber);
MAKE_SYSTEM_PROP(AUTODETECT_LINK,UIDataDetectorTypeLink);
MAKE_SYSTEM_PROP(AUTODETECT_ADDRESS,UIDataDetectorTypeAddress);
MAKE_SYSTEM_PROP(AUTODETECT_CALENDAR,UIDataDetectorTypeCalendarEvent);

MAKE_SYSTEM_STR(COLOR_SCROLLVIEW_BACKGROUND, IOS_COLOR_SCROLLVIEW_TEXTURED_BACKGROUND);
MAKE_SYSTEM_STR(COLOR_VIEW_FLIPSIDE_BACKGROUND, IOS_COLOR_VIEW_FLIPSIDE_BACKGROUND);
MAKE_SYSTEM_STR(COLOR_GROUP_TABLEVIEW_BACKGROUND, IOS_COLOR_GROUP_TABLEVIEW_BACKGROUND);

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_5_0
    MAKE_SYSTEM_STR(COLOR_UNDER_PAGE_BACKGROUND, IOS_COLOR_UNDER_PAGE_BACKGROUND);
#endif


MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_LINK_CLICKED,UIWebViewNavigationTypeLinkClicked);
MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_FORM_SUBMITTED,UIWebViewNavigationTypeFormSubmitted);
MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_BACK_FORWARD,UIWebViewNavigationTypeBackForward);
MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_RELOAD,UIWebViewNavigationTypeReload);
MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_FORM_RESUBMITTED,UIWebViewNavigationTypeFormResubmitted);
MAKE_SYSTEM_PROP(WEBVIEW_NAVIGATIONTYPE_OTHER,UIWebViewNavigationTypeOther);

#endif
@end

#endif
