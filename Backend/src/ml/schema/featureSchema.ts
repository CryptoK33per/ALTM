export const FEATURE_INDEX = {

  // rule features
  rule_encoded_powershell: 0,
  rule_certutil_download: 1,
  rule_weird_time_script: 2,

  // process features
  runs_from_temp: 3,
  runs_from_appdata: 4,
  runs_from_program_files: 5,
  path_depth: 6,
  has_version_pattern: 7,

  // command features
  command_length: 8,
  contains_url: 9,
  contains_ip: 10,
  contains_base64: 11,
  suspicious_keyword_count: 12,

  // parent-child
  office_spawn_shell: 13,
  browser_spawn_shell: 14,
  parent_same_process: 15,

  // temporal
  time_bucket_00_05: 16,
  time_bucket_06_11: 17,
  time_bucket_12_17: 18,
  time_bucket_18_23: 19,

  // user
  is_system_account: 20,
  is_high_integrity: 21,

  // hash
  hash_present: 22,
  hash_type_count: 23

};