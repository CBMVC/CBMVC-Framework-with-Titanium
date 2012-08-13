/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiUIAlertDialogProxy.h"
#import "TiUtils.h"

static NSCondition* alertCondition;
static BOOL alertShowing = NO;

@implementation TiUIAlertDialogProxy

-(void)_destroy
{
    if (alert != nil) {
        [alertCondition lock];
        alertShowing = NO;
        [alertCondition broadcast];
        [alertCondition unlock];
    }
    [[NSNotificationCenter defaultCenter] removeObserver:self];
	RELEASE_TO_NIL(alert);
	[super _destroy];
}

-(NSMutableDictionary*)langConversionTable
{
	return [NSMutableDictionary dictionaryWithObjectsAndKeys:
			@"title",@"titleid",
			@"ok",@"okid",
			@"message",@"messageid",
			nil];
}

-(void) cleanup
{
	if(alert != nil)
	{
		[alertCondition lock];
		alertShowing = NO;
		[alertCondition broadcast];
		[alertCondition unlock];
		[self forgetSelf];
		[self autorelease];
		RELEASE_TO_NIL(alert);
		[[NSNotificationCenter defaultCenter] removeObserver:self];
	}
}

-(void)hide:(id)args
{
	ENSURE_SINGLE_ARG_OR_NIL(args,NSDictionary);
	ENSURE_UI_THREAD_1_ARG(args);
	
	if (alert!=nil)
	{
		//On IOS5 sometimes the delegate does not get called when hide is called soon after show
		//So we do the cleanup here itself
		
		//Remove ourselves as the delegate. This ensures didDismissWithButtonIndex is not called on dismissWithClickedButtonIndex
		[alert setDelegate:nil];
		BOOL animated = [TiUtils boolValue:@"animated" properties:args def:YES];
		[alert dismissWithClickedButtonIndex:[alert cancelButtonIndex] animated:animated];
		[self cleanup];
	}
}

-(void)show:(id)args
{
	if (alertCondition==nil)
	{
		alertCondition = [[NSCondition alloc] init];
	}
	
	// prevent more than one JS thread from showing an alert box at a time
	if ([NSThread isMainThread]==NO)
	{
		[self rememberSelf];
		
		[alertCondition lock];
		if (alertShowing)
		{
			[alertCondition wait];
		}
		alertShowing = YES;
		[alertCondition unlock];
		// alert show should block the JS thread like the browser
		TiThreadPerformOnMainThread(^{[self show:args];}, YES);
	}
	else
	{
		RELEASE_TO_NIL(alert);
		
		[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(suspended:) name:kTiSuspendNotification object:nil];
		
		NSMutableArray *buttonNames = [self valueForKey:@"buttonNames"];
		if (buttonNames==nil || (id)buttonNames == [NSNull null])
		{
			buttonNames = [[[NSMutableArray alloc] initWithCapacity:2] autorelease];
			NSString *ok = [self valueForUndefinedKey:@"ok"];
			if (ok==nil)
			{
				ok = @"OK";
			}
			[buttonNames addObject:ok];
		}
		
		alert = [[UIAlertView alloc] initWithTitle:[TiUtils stringValue:[self valueForKey:@"title"]]
												message:[TiUtils stringValue:[self valueForKey:@"message"]] 
												delegate:self cancelButtonTitle:nil otherButtonTitles:nil];
		for (id btn in buttonNames)
		{
			NSString * thisButtonName = [TiUtils stringValue:btn];
			[alert addButtonWithTitle:thisButtonName];
		}

		[alert setCancelButtonIndex:[TiUtils intValue:[self valueForKey:@"cancel"] def:-1]];
		
		[self retain];
		[alert show];
	}
}

-(void)suspended:(NSNotification*)note
{
	[self hide:[NSDictionary dictionaryWithObject:NUMBOOL(NO) forKey:@"animated"]];
}

#pragma mark AlertView Delegate

- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex
{
	[self cleanup];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
	if ([self _hasListeners:@"click"])
	{
		NSDictionary *event = [NSDictionary dictionaryWithObjectsAndKeys:
							   [NSNumber numberWithInt:buttonIndex],@"index",
							   [NSNumber numberWithInt:[alertView cancelButtonIndex]],@"cancel",
							   nil];
		[self fireEvent:@"click" withObject:event];
	}
}

@end
