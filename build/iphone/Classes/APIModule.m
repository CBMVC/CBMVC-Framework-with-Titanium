/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "APIModule.h"
#import "TiUtils.h"
#import "TiBase.h"
#import "TiApp.h"
#import "TiDebugger.h"

@implementation APIModule

-(void)logMessage:(NSArray*)args severity:(NSString*)severity
{
    NSMutableString* message = [NSMutableString string];
    
    if ([[TiApp app] debugMode]) {
        NSString* lcSeverity = [severity lowercaseString];
        DebuggerLogLevel level = OUT;
        NSMutableArray* messages = [NSMutableArray arrayWithArray:args];
        
        if ([lcSeverity isEqualToString:@"warn"]) {
            level = WARN;
        }
        else if ([lcSeverity isEqualToString:@"error"] ||
                 [lcSeverity isEqualToString:@"critical"] ||
                 [lcSeverity isEqualToString:@"fatal"]) {
            level = ERR;
        }
        else if ([lcSeverity isEqualToString:@"trace"]) {
            level = TRACE;
        }
        else if ([lcSeverity isEqualToString:@"debug"]) {
            level = LOG_DEBUG;
        }
        else if (![lcSeverity isEqualToString:@"info"]) { // Custom severity, or just a badly-formed log; either way, debugger treats it as info
            [messages insertObject:[NSString stringWithFormat:@"[%@]", severity] atIndex:0];
        }
        
        TiDebuggerLogMessage(level, [messages componentsJoinedByString:@" "]);
    }
    else {
        NSLog(@"[%@] %@", [severity uppercaseString], [args componentsJoinedByString:@" "]);
        fflush(stderr);
    }
}

-(id)transform:(id)arg
{
	return [TiUtils exceptionMessage:arg];
}

-(void)debug:(NSArray*)args
{
    [self logMessage:args severity:@"debug"];
}

-(void)info:(NSArray*)args
{
    [self logMessage:args severity:@"info"];    
}

-(void)warn:(NSArray*)args
{
    [self logMessage:args severity:@"warn"];        
}

-(void)error:(NSArray*)args
{
    [self logMessage:args severity:@"error"];            
}

-(void)trace:(NSArray*)args
{
    [self logMessage:args severity:@"trace"];
}

-(void)timestamp:(NSArray*)args
{
	NSLog(@"[TIMESTAMP] %f %@", [NSDate timeIntervalSinceReferenceDate], [self transform:[args objectAtIndex:0]]);
	fflush(stderr);
}

-(void)notice:(NSArray*)args
{
    [self logMessage:args severity:@"info"];
}

-(void)critical:(NSArray*)args
{
    [self logMessage:args severity:@"error"];
}

-(void)log:(NSArray*)args
{
    if ([args count] > 1) {
        [self logMessage:[args subarrayWithRange:NSMakeRange(1, [args count]-1)] severity:[args objectAtIndex:0]];
    }
    else {
        [self logMessage:args severity:@"info"];
    }
}

-(void)reportUnhandledException:(NSArray*)args
{
	id lineNumber = [args objectAtIndex:0];
	id source = [args objectAtIndex:1];
	id message = [args objectAtIndex:2];
	
	NSLog(@"[ERROR] %@:%@ %@",source,lineNumber,message);
	fflush(stderr);
}


@end