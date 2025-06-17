const BASE_URL = `https://poultryapidemo.navfarm.com/api`;

export const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'X-ApiKey': 'MyRandomApiKeyValue',
  Authorization: `Basic ${btoa(
    'xYvN7EOnhzdnTinyuq8amuhzRaBxNeOeeJyrp3/L0+Y=:f4eqUIMzUI4UyBwnFJOPhji8D2umvEC2GzJFDOmRzB8=',
  )}`,
};

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/signin`,
  COMMON_DETAILS: `/get_common_details`,
  Dashboard_NOB: '/Get_Configuration_Setup',
  DataEntryList: '/get_dataentry_summary',
  DataEntryDetails: '/get_dataentry_details',
  SaveAndPostDataEntry: '/insert_dataentry',
  DataEntrySearchedDetails: '/get_dataentry_details_json',
  Daily_DataEntrySearchedDetails: '/get_dataentry_poultry_details_bulk',
  Batch_Comparison_DataEntrySearchedDetails: '/get_flock_wise_fcr',
  NOB_Dropdown_Data: '/get_nob',
  LOB_Dropdown_Data: '/get_lob',
  Template_Dropdown_Data: '/get_templates',
  Location_Dropdown_Data: '/get_all_locations',
  TemplateBatches_Dropdown_Data: '/get_template_batches',
  Batches_getByLocation_Dropdown_Data: '/get_batches_by_location',
  DailyDataEntry_Save_And_Post: '/insert_dataentry_bulk',
  BATCH_Dropdown_Data: '/get_batches',
  DASHBOARD_DATA: '/get_dashboard',
  LocationOutputGraph: '/get_dashboard_location_output_graph',
  LocationRunningCostGraph: '/get_dashboard_location_running_cost_graph',
};
