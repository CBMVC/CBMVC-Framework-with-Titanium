/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UISCROLLABLEVIEW

#import "TiUIView.h"

@interface TiUIScrollableView : TiUIView<UIScrollViewDelegate> {
@private
	UIScrollView *scrollview;
	UIPageControl *pageControl;
	int currentPage; // Duplicate some info, just in case we're not showing the page control
	BOOL showPageControl;
	UIColor *pageControlBackgroundColor;
	CGFloat pageControlHeight;
    CGFloat pagingControlAlpha;
	BOOL handlingPageControlEvent;
    BOOL scrollingEnabled;
    BOOL pagingControlOnTop;
    BOOL overlayEnabled;
    // Have to correct for an apple goof; rotation stops scrolling, AND doesn't move to the next page.
    BOOL rotatedWhileScrolling;

    // See the code for why we need this...
    int lastPage;
    BOOL enforceCacheRecalculation;
    int cacheSize;
    
}

-(void)manageRotation;
-(UIScrollView*)scrollview;
-(void)setCurrentPage_:(id)page;
-(void)setScrollingEnabled_:(id)enabled;
-(void)refreshScrollView:(CGRect)visibleBounds readd:(BOOL)readd;
@end

#endif