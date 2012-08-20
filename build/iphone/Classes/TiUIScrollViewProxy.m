/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UISCROLLVIEW

#import "TiUIScrollViewProxy.h"
#import "TiUIScrollView.h"

#import "TiUtils.h"

@implementation TiUIScrollViewProxy

-(void)_initWithProperties:(NSDictionary *)properties
{
	// set the initial scale to 1.0 which is the default
	// FIXME: Not going to do this right before release because it might break some things, but we should rename this property to zoomScale and tie it to the scroll view's value.
	[self replaceValue:NUMFLOAT(1.0) forKey:@"scale" notification:NO];
	[self replaceValue:NUMBOOL(YES) forKey:@"canCancelEvents" notification:NO];
	[super _initWithProperties:properties];
}

-(TiPoint *) contentOffset{
    if([self viewAttached]){
        TiThreadPerformOnMainThread(^{
                   contentOffset = [[TiPoint alloc] initWithPoint:CGPointMake(
                                        [(TiUIScrollView *)[self view] scrollView].contentOffset.x,
                                        [(TiUIScrollView *)[self view] scrollView].contentOffset.y)] ; 
          }, YES);
    }
    else{
        contentOffset = [[TiPoint alloc] initWithPoint:CGPointMake(0,0)];
    }
    return [contentOffset autorelease];
}

-(void)windowWillOpen
{
    [super windowWillOpen];
    //Since layout children is overridden in scrollview need to make sure that 
    //a full layout occurs atleast once if view is attached
    if ([self viewAttached]) {
        [self contentsWillChange];
    }
}

-(void)contentsWillChange
{
	if ([self viewAttached])
	{
		[(TiUIScrollView *)[self view] setNeedsHandleContentSize];
	}
	[super contentsWillChange];
}

-(void)willChangeSize
{
	if ([self viewAttached])
	{
		[(TiUIScrollView *)[self view] setNeedsHandleContentSizeIfAutosizing];
	}
	[super willChangeSize];
}


-(void)layoutChildren:(BOOL)optimize
{
	if (![self viewAttached])
	{
		return;
	}

	if (![(TiUIScrollView *)[self view] handleContentSizeIfNeeded])
	{
		[super layoutChildren:optimize];
	}
}

-(CGFloat)autoHeightForSize:(CGSize)size
{
    if(TiLayoutRuleIsHorizontal(layoutProperties.layoutStyle))
    {
        //Horizontal Layout in scrollview is not a traditional horizontal layout. So need an override

        //This is the content width, which is implemented by widgets
        CGFloat contentHeight = -1.0;
        if ([self respondsToSelector:@selector(contentHeightForWidth:)]) {
            contentHeight = [self contentHeightForWidth:size.width];
        }
        
        CGFloat result=0.0;
        CGFloat thisHeight = 0.0;
        pthread_rwlock_rdlock(&childrenLock);
        NSArray* array = windowOpened ? children : pendingAdds;
        
        for (TiViewProxy * thisChildProxy in array)
        {
            thisHeight = [thisChildProxy minimumParentHeightForSize:size];
            if(result<thisHeight) {
                result = thisHeight;
            }
        }
        pthread_rwlock_unlock(&childrenLock);
        
        if (result < contentHeight) {
            result = contentHeight;
        }
        
        if([self respondsToSelector:@selector(verifyHeight:)])
        {
            result = [self verifyHeight:result];
        }
        
        if (result == 0)
        {
            NSLog(@"[WARN] %@ has an auto height value of 0, meaning this view may not be visible.",self);
        }
        return result;
    }
    else {
        return [super autoHeightForSize:size];
    }
}

-(CGRect)computeChildSandbox:(TiViewProxy*)child withBounds:(CGRect)bounds
{
    if ([self viewAttached]) {
        //ScrollView calls this with wrapper view bounds. Make sure it is set to the right bound
        bounds = [[self view] bounds];
    }
    if(TiLayoutRuleIsHorizontal(layoutProperties.layoutStyle))
    {
        //Horizontal Layout in scrollview is not a traditional horizontal layout. So need an override
        BOOL followsFillBehavior = TiDimensionIsAutoFill([child defaultAutoWidthBehavior:nil]);
        bounds.origin.x = horizontalLayoutBoundary;
        CGFloat boundingValue = bounds.size.width-horizontalLayoutBoundary;
        if (boundingValue < 0) {
            boundingValue = 0;
        }
        //TOP + BOTTOM
        CGFloat offset2 = TiDimensionCalculateValue([child layoutProperties]->top, bounds.size.height)
        + TiDimensionCalculateValue([child layoutProperties]->bottom, bounds.size.height);
        //LEFT + RIGHT
        CGFloat offset = TiDimensionCalculateValue([child layoutProperties]->left, boundingValue)
        + TiDimensionCalculateValue([child layoutProperties]->right, boundingValue);
        
        TiDimension constraint = [child layoutProperties]->width;
        
        if (TiDimensionIsDip(constraint) || TiDimensionIsPercent(constraint))
        {
            //Percent or absolute of total width so leave the sandbox and just increment the boundary
            bounds.size.width =  TiDimensionCalculateValue(constraint, bounds.size.width) + offset;
            horizontalLayoutBoundary += bounds.size.width;
        }
        else if (TiDimensionIsAutoFill(constraint))
        {
            //Fill up the remaining
            bounds.size.width = boundingValue + offset;
            horizontalLayoutBoundary += bounds.size.width;
        }
        else if (TiDimensionIsAutoSize(constraint))
        {
            bounds.size.width = [child autoWidthForSize:CGSizeMake(boundingValue,bounds.size.height - offset2)] + offset;
            horizontalLayoutBoundary += bounds.size.width;
        }
        else if (TiDimensionIsAuto(constraint) )
        {
            if (followsFillBehavior) {
                //FILL behavior
                bounds.size.width = boundingValue + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
            else {
                //SIZE behavior
                bounds.size.width = [child autoWidthForSize:CGSizeMake(boundingValue,bounds.size.height - offset2)] + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
        }
        else if (TiDimensionIsUndefined(constraint))
        {
            if (!TiDimensionIsUndefined([child layoutProperties]->left) && !TiDimensionIsUndefined([child layoutProperties]->centerX) ) {
                CGFloat width = 2 * ( TiDimensionCalculateValue([child layoutProperties]->centerX, boundingValue) - TiDimensionCalculateValue([child layoutProperties]->left, boundingValue) );
                bounds.size.width = width + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
            else if (!TiDimensionIsUndefined([child layoutProperties]->left) && !TiDimensionIsUndefined([child layoutProperties]->right) ) {
                bounds.size.width = boundingValue + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
            else if (!TiDimensionIsUndefined([child layoutProperties]->centerX) && !TiDimensionIsUndefined([child layoutProperties]->right) ) {
                CGFloat width = 2 * ( boundingValue - TiDimensionCalculateValue([child layoutProperties]->right, boundingValue) - TiDimensionCalculateValue([child layoutProperties]->centerX, boundingValue));
                bounds.size.width = width + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
            else if (followsFillBehavior) {
                //FILL behavior
                bounds.size.width = boundingValue + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
            else {
                //SIZE behavior
                bounds.size.width = [child autoWidthForSize:CGSizeMake(boundingValue,bounds.size.height - offset2)] + offset;
                horizontalLayoutBoundary += bounds.size.width;
            }
        }
        
        return bounds;
    }
    else {
        return [super computeChildSandbox:child withBounds:bounds];
    }
}

-(void)childWillResize:(TiViewProxy *)child
{
	[super childWillResize:child];
	[(TiUIScrollView *)[self view] setNeedsHandleContentSizeIfAutosizing];
}

-(UIView *)parentViewForChild:(TiViewProxy *)child
{
	return [(TiUIScrollView *)[self view] wrapperView];
}

-(void)scrollTo:(id)args
{
	ENSURE_ARG_COUNT(args,2);
	TiPoint * offset = [[TiPoint alloc] initWithPoint:CGPointMake(
			[TiUtils floatValue:[args objectAtIndex:0]],
			[TiUtils floatValue:[args objectAtIndex:1]])];

	[self setContentOffset:offset withObject:Nil];
	[offset release];
}
-(void) setContentOffset:(id)value withObject:(id)animated
{
    TiThreadPerformOnMainThread(^{
        [(TiUIScrollView *)[self view] setContentOffset_:value withObject:animated];
    }, YES);
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView_               // scrolling has ended
{
	if ([self _hasListeners:@"scrollEnd"])
	{
		[self fireEvent:@"scrollEnd" withObject:nil];
	}
}

-(void)scrollViewDidScroll:(UIScrollView *)scrollView
{
	CGPoint offset = [scrollView contentOffset];
	if ([self _hasListeners:@"scroll"])
	{
		[self fireEvent:@"scroll" withObject:[NSDictionary dictionaryWithObjectsAndKeys:
				NUMFLOAT(offset.x),@"x",
				NUMFLOAT(offset.y),@"y",
				NUMBOOL([scrollView isDecelerating]),@"decelerating",
				NUMBOOL([scrollView isDragging]),@"dragging",
				nil]];
	}
}

- (void)scrollViewDidEndZooming:(UIScrollView *)scrollView withView:(UIView *)view atScale:(float)scale
{
	[self replaceValue:NUMFLOAT(scale) forKey:@"scale" notification:NO];
	
	if ([self _hasListeners:@"scale"])
	{
		[self fireEvent:@"scale" withObject:[NSDictionary dictionaryWithObjectsAndKeys:
											  NUMFLOAT(scale),@"scale",
											  nil]];
	}
}

-(void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
	if([self _hasListeners:@"dragStart"])
	{
		[self fireEvent:@"dragStart" withObject:nil];
	}
}

//listerner which tells when dragging ended in the scroll view.

-(void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
	if([self _hasListeners:@"dragEnd"])
	{
		[self fireEvent:@"dragEnd" withObject:[NSDictionary dictionaryWithObjectsAndKeys:[NSNumber numberWithBool:decelerate],@"decelerate",nil]]	;
	}
}


@end

#endif