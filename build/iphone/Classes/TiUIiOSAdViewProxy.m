/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2010 by CoderBlog, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiBase.h"
#import "TiUIiOSAdViewProxy.h"
#import "TiUIiOSAdView.h"
#import "TiUtils.h"

#ifdef USE_TI_UIIOSADVIEW

#import <iAd/iAd.h>

@implementation TiUIiOSAdViewProxy

+(NSString*)portraitSize
{
	if ([TiUtils isIOS4_2OrGreater]) {
		return ADBannerContentSizeIdentifierPortrait;
	}
	return @"ADBannerContentSize320x50";
}

+(NSString*)landscapeSize
{
	if ([TiUtils isIOS4_2OrGreater]) {
		return ADBannerContentSizeIdentifierLandscape;
	}
	return @"ADBannerContentSize480x32";
}

USE_VIEW_FOR_CONTENT_HEIGHT
USE_VIEW_FOR_CONTENT_WIDTH

-(void)cancelAction:(id)args
{
	[self makeViewPerformSelector:@selector(cancelAction:) withObject:args createIfNeeded:YES waitUntilDone:NO];
}


-(NSString*)adSize
{
    __block NSString* adSize;
    
    TiThreadPerformOnMainThread(^{
        adSize = [[(TiUIiOSAdView*)[self view] adview] currentContentSizeIdentifier];
    }, YES);
    
    return adSize;
}

-(void)setAdSize:(id)arg
{
	ENSURE_SINGLE_ARG(arg,NSString);
    
    // Sanity check values
    if (!([arg isEqualToString:[TiUIiOSAdViewProxy portraitSize]] || [arg isEqualToString:[TiUIiOSAdViewProxy landscapeSize]])) {
        [self throwException:@"TiInvalidArg" 
                   subreason:@"Invalid value for CoderBlog.UI.iOS.AdView.adSize"
                    location:CODELOCATION];
    }
    
    // Need to ensure the size is set on the UI thread
    [self makeViewPerformSelector:@selector(setAdSize:) withObject:arg createIfNeeded:YES waitUntilDone:NO];
}

@end

#endif