/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiUIWindow.h"
#import "TiUIWindowProxy.h"

@implementation TiUIWindow

- (void) dealloc
{
	RELEASE_TO_NIL(gradientWrapperView);
	[super dealloc];
}


-(UIView *)gradientWrapperView
{
	if (gradientWrapperView == nil)
	{
		gradientWrapperView = [[UIView alloc] initWithFrame:[self bounds]];
		[gradientWrapperView setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
		[self insertSubview:gradientWrapperView atIndex:0];
	}

	return gradientWrapperView;
}

-(void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
    [super frameSizeChanged:frame bounds:bounds];
    
    //Need the delay so that we get the right navbar bounds
    TiProxy* windowProxy = [self proxy];
    if ([windowProxy respondsToSelector:@selector(_updateTitleView)]) {
        [windowProxy performSelector:@selector(_updateTitleView) 
                           withObject:nil 
                           afterDelay:[[UIApplication sharedApplication] statusBarOrientationAnimationDuration] ];
    }
}


@end

