/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"GTkFmmCZ4eNXHy7FhTH8kuITjSpD6P0V"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"3uxJzop9xSGs4SO8HegcKI5hpWXsJmwf"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"EsGMztlHVgHiV0CuI7u66UYDoDWGgIwR"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"jhYINi5MiXZ5NYA6jUzteNRTJW0Nj18s"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"Uyzwu100hL4fy1STNZNEILS03aVUAKZP"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"mBCO5rYNZexZzqTAlbiSrrbdqYALiTzh"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];
    [_property setObject:[NSNumber numberWithBool:[TiUtils boolValue:@"true"]] forKey:@"ti.android.fastdev"];

    return _property;
}
@end
