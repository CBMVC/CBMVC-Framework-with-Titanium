/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiAppiOSLocalNotificationProxy.h"
#import "TiUtils.h"

#ifdef USE_TI_APPIOS

@implementation TiAppiOSLocalNotificationProxy

@synthesize notification;

-(void)dealloc
{
	[self cancel:nil];
	RELEASE_TO_NIL(notification);
	[super dealloc];
}

-(void)cancel:(id)args
{
	UILocalNotification * cancelledNotification = [notification retain];
	TiThreadPerformOnMainThread(^{[[UIApplication sharedApplication] cancelLocalNotification:cancelledNotification];
		[cancelledNotification release];}, NO);
}

@end

#endif
