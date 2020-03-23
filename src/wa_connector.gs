// -----------------------------------------------------------------------------------------------------------------
// Google Data Studio Community Data Connector for Wild Apricot
// Copyright (c) 2018-20 NewPath Consulting Inc.
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// Originally created by Edmond Tsoi (https://github.com/edtsoi430) for NewPath Consulting Inc.
// Maintained by Lon Motero (https://github.com/lmatero) for NewPath Consulting Inc.
// Further developed and restructured by Dennis Yoseph Zvigelsky (https://github.com/dzvigelsky) for NewPath Consulting Inc.
// Contact NewPath Consulting for support at https://www.newpathconsulting.com

// Global Variables------------------
var wa_connector = wa_connector || {}; // creates the connector Class, which will be called in Code.gs

var API_PATHS = {
  // Api path that will be called in the getData function
  auth: "https://oauth.wildapricot.org/auth/token",
  accounts: "https://api.wildapricot.org/v2.1/accounts/"
};
var token;

var cc = DataStudioApp.createCommunityConnector();
// ----------------------------------

wa_connector.getConfig = function(request) {
  // code for getConfig function
  var configParams = request.configParams;
  var isFirstRequest = configParams === undefined;
  var config = cc.getConfig();

  config
    .newTextInput()
    .setId("apikey")
    .setName("API key")
    .setAllowOverride(true)
    .setHelpText("Read https://gethelp.wildapricot.com/en/articles/180 for instructions on creating an API key.");

  config
    .newInfo()
    .setId("apikeyErrorLabel")
    .setText(
      "Wild Apricot API key is required. Read https://gethelp.wildapricot.com/en/articles/180 for instructions on creating an API key."
    );

  config
    .newSelectSingle()
    .setId("resource")
    .setName("Select Wild Apricot object")
    .setIsDynamic(true)
    .setHelpText("Wild Apricot Reports Manager will retrieve available data for the selected object through the API.")
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Contacts")
        .setValue("contacts")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Contact custom fields")
        .setValue("custom")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Account")
        .setValue("account")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Membership Level")
        .setValue("membershipLevels")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Event")
        .setValue("event")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("AuditLog")
        .setValue("auditLog")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Invoices")
        .setValue("invoices")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Sent emails")
        .setValue("sentEmails")
    );

  config
    .newInfo()
    .setId("resourceErrorLabel")
    .setText("Wild Apricot object is required.");

  var shouldShowContactFields = !isFirstRequest && (configParams.resource === "contacts" || configParams.resource === "custom");
  var shouldShowInvoicesFields = !isFirstRequest && configParams.resource === "invoices";
  var shouldShowAuditLogFields = !isFirstRequest && configParams.resource === "auditLog";
  var shouldShowSentEmailsFields = !isFirstRequest && configParams.resource === "sentEmails";
  var shouldShowEventFields = !isFirstRequest && configParams.resource === "event";
  var shouldShowPageField =
    shouldShowContactFields || shouldShowInvoicesFields || shouldShowAuditLogFields || shouldShowEventFields || shouldShowSentEmailsFields;
  var shouldShowFilterField = shouldShowContactFields || shouldShowEventFields || shouldShowSentEmailsFields;
  var shouldShowCountField = shouldShowContactFields;

  if (shouldShowPageField) {
    config
      .newSelectSingle()
      .setId("Paging")
      .setName("Select page size")
      .setHelpText(
        "Set your paging size to 1000 (or less) to avoid timeouts when accessing more than 2000 contacts. Set paging size to 2000 (or more) to speed up reports when accessing less than 2000 contacts. When adding more than 3 reports per page, try to reduce page size to avoid timeouts."
      )
      .setAllowOverride(true)
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("100")
          .setValue("100")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("500")
          .setValue("500")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("1000")
          .setValue("1000")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("1500")
          .setValue("1500")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("2000")
          .setValue("2000")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("2500")
          .setValue("2500")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("3000")
          .setValue("3000")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("3500")
          .setValue("3500")
      )
      .addOption(
        config
          .newOptionBuilder()
          .setLabel("4000")
          .setValue("4000")
      );

    config
      .newInfo()
      .setId("PagingErrorLabel")
      .setText("Page size is required.");
  }

  if (shouldShowFilterField) {
    var contactsFilterText =
      "Create a filter clause to return only a subset of contact records to speed up processing in Google Data Studio. See https://gethelp.wildapricot.com/en/articles/502#filtering for more details.";
    var eventsFilterText =
      "Create a filter clause to return only a subset of event records to speed up processing in Google Data Studio. See https://gethelp.wildapricot.com/en/articles/499-events-admin-api-call#filtering for more details.";
    var sentEmailsFilterText =
      "Allowed filter fields (allowed operations):\n\nSentDate (ge, le),\nSenderId (eq) - ID of sender,\nOriginType (eq) - see SentEmail.Origin.OriginType,\nSendingType (eq) -SentEmail.SendingType (Automatic or Manual)\n\nThe AND boolean operator supported only for this filter.\n\n...&$filter=SentDate ge 2018-05-01 - will return records sent on or after May 1st, 2018";
    var filterText = contactsFilterText;

    if (shouldShowEventFields) {
      filterText = eventsFilterText;
    } else if (shouldShowSentEmailsFields) {
      filterText = sentEmailsFilterText;
    }

    config
      .newTextInput()
      .setId("filter")
      .setName("Filter")
      .setAllowOverride(true)
      .setHelpText(filterText);

    config
      .newInfo()
      .setId("FilterLabel")
      .setText(filterText);
  }

  if (shouldShowCountField) {
    config
      .newCheckbox()
      .setId("countOnly")
      .setName("Return count only")
      .setAllowOverride(true)
      .setHelpText("If checked, only the total record count will be returned in the report.");
  }

  if (shouldShowInvoicesFields) {
    config
      .newCheckbox()
      .setId("includeVoided")
      .setName("Include voided invoices")
      .setAllowOverride(true)
      .setHelpText("If checked, voided invoices will be included in the report.");
  }

  if (shouldShowContactFields) {
    config
      .newCheckbox()
      .setId("archived")
      .setName("Include Archived contacts")
      .setAllowOverride(true)
      .setHelpText("If checked, Archived contacts will be included in the report.");

    config
      .newCheckbox()
      .setId("membership")
      .setName("Include Members only")
      .setAllowOverride(true)
      .setHelpText("If checked, only Members will be included in the report.");
  }

  var isResourceEmpty = isFirstRequest || configParams.resource === undefined || configParams.resource === null;
  var isApiKeyEmpty = isFirstRequest || configParams.apikey === undefined || configParams.apikey === null;
  var isPagingEmpty = isFirstRequest || configParams.Paging === undefined || configParams.Paging === null;
  var isDateRangeRequired =
    !isFirstRequest &&
    (configParams.resource === "auditLog" || configParams.resource === "invoices" || configParams.resource === "contacts");
  var canProceedToNextStep = !isApiKeyEmpty && !isResourceEmpty && (!shouldShowPageField || (shouldShowPageField && !isPagingEmpty));

  if (isDateRangeRequired) {
    config.setDateRangeRequired(true);
  }

  if (!canProceedToNextStep) {
    config.setIsSteppedConfig(true);

    if (!isFirstRequest) {
      if (isResourceEmpty) {
        cc.newUserError().setDebugText("Wild Apricot object is required.");
      } else if (isApiKeyEmpty) {
        cc.newUserError().setDebugText("API key is required.");
      } else if (isPagingEmpty) {
        cc.newUserError().setDebugText("Page size is required.");
      }
    }
  }

  return config.build();
};

// Written by Edmond @2019 for Community Connector v1.3, added in custom, dynamic schema that accounts for custom fields (custom request)
function custom(request) {
  if (!token) {
    token = _getAccessToken(request.configParams.apikey);
  }
  var account = _fetchAPI(API_PATHS.accounts, token)[0];
  var contactfieldsEndpoint = API_PATHS.accounts + account.Id + "/contactfields?showSectionDividers=false";
  var arr = [map_schema("account_id", "AccountId")];
  var cfs = _fetchAPI(contactfieldsEndpoint, token);
  cfs.forEach(function(cf) {
    if (cf.SystemCode.substring(0, 7) == "custom-" || cf.SystemCode == "FirstName" || cf.SystemCode == "LastName") {
      console.log(cf.FieldType);
      arr.push(map_schema(cf.FieldType, cf.FieldName));
    } else if (cf.SystemCode == "MemberId") {
      // In the returned JSON, the field User ID has undefined field type. (use ID instead)
      arr.push(map_schema("ID", cf.FieldName));
    }
  });
  return arr;
}

// Replace spaces in field name with ""
function format_field(fn_in) {
  fn_in = fn_in.replace(/\s/g, ""); // Remove space
  return fn_in.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "").toString(); // Remove special characters
}

function map_schema(ft_in, fn_in) {
  var fn = format_field(fn_in); // format field name to meet GDS requirement
  switch (ft_in) {
    case "RulesAndTerms":
      var f_set = {};
      var semantics = {};
      semantics["conceptType"] = "DIMENSION";
      semantics["semanticType"] = "BOOLEAN";
      f_set["semantics"] = semantics;
      f_set["name"] = fn;
      f_set["label"] = fn_in; //+ "---" + ft_in;
      f_set["dataType"] = "BOOLEAN";
      return f_set;
    case "Date": // *****
      var f_set = {};
      var semantics = {};
      semantics["conceptType"] = "DIMENSION";
      semantics["semanticType"] = "YEAR_MONTH_DAY";
      f_set["semantics"] = semantics;
      f_set["name"] = fn;
      f_set["label"] = fn_in; //+ "---" + ft_in;
      f_set["dataType"] = "STRING";
      return f_set;
    case "ID":
    case "account_id":
    case "ExtraChargeCalculation":
      var f_set = {};
      var semantics = {};
      semantics["conceptType"] = "METRIC";
      f_set["semantics"] = semantics;
      f_set["name"] = fn;
      f_set["label"] = fn_in; //+ "---" + ft_in;
      f_set["dataType"] = "NUMBER";
      return f_set;
    default:
      // Dropdown, Text, Picture (for now), MultilineText, MultipleChoice, RadioButtons, MultipleChoiceWithExtraCharge, RadioButtonsWithExtraCharge
      var f_set = {};
      var semantics = {};
      semantics["conceptType"] = "DIMENSION";
      f_set["semantics"] = semantics;
      f_set["name"] = fn;
      f_set["label"] = fn_in; //+ "--- " + ft_in;
      f_set["dataType"] = "STRING";
      return f_set;
  }
}

wa_connector.getSchema = function(request) {
  var isSchemaCustom = request.configParams.resource === "custom";
  var schema = isSchemaCustom ? custom(request) : WASchema[request.configParams.resource];
  var doesSchemaHaveCurrency = false;

  for (var i = 0; i < schema.length; i++) {
    var schemaItem = schema[i];
    if ("semanticGroup" in schemaItem.semantics && schemaItem.semantics.semanticGroup === "CURRENCY") {
      doesSchemaHaveCurrency = true;
      break;
    }
  }

  if (doesSchemaHaveCurrency) {
    if (!token) {
      token = _getAccessToken(request.configParams.apikey);
    }
    var account = _fetchAPI(API_PATHS.accounts, token)[0];
    var currencyCode = account.Currency.Code;

    for (var i = 0; i < schema.length; i++) {
      var schemaItem = schema[i];
      if ("semanticGroup" in schemaItem.semantics && schemaItem.semantics.semanticGroup === "CURRENCY") {
        schemaItem.semantics.semanticType = "CURRENCY_" + currencyCode.toUpperCase();
      }
    }
  }
  return { schema: schema };
};

wa_connector.getData = function(request) {
  // Dictionary mapping field name(keys) to field types(vals)
  var field_maps = {};
  // Account Id
  field_maps["AccountId"] = "account_id";
  var rows = [];
  var schema = WASchema[request.configParams.resource];
  if (!token) {
    token = _getAccessToken(request.configParams.apikey);
  }
  var account = _fetchAPI(API_PATHS.accounts, token)[0];
  if (request.configParams.resource == "custom") {
    var contactfieldsEndpoint = API_PATHS.accounts + account.Id + "/contactfields?showSectionDividers=false";
    var cfs = _fetchAPI(contactfieldsEndpoint, token);
    cfs.forEach(function(cf) {
      if (cf.SystemCode.substring(0, 7) == "custom-" || cf.SystemCode == "FirstName" || cf.SystemCode == "LastName") {
        field_maps[format_field(cf.FieldName)] = cf.FieldType;
      } else if (cf.SystemCode == "MemberId") {
        field_maps[format_field(cf.FieldName)] = "ID1";
      }
    });
    schema = custom(request);
  }
  var selectedDimensionsMetrics = _filterSelectedItems(schema, request.fields);
  //  Logger.log(selectedDimensionsMetrics);
  if (request.configParams.resource == "account") {
    //ACCOUNT
    var row = [];
    selectedDimensionsMetrics.forEach(function(field) {
      switch (field.name) {
        case "Id":
          row.push(account.Id);
          break;
        case "PrimaryDomainName":
          row.push(account.PrimaryDomainName);
          break;
        case "Name":
          row.push(account.Name);
          break;
        default:
      }
    });
    rows.push({ values: row });
  } else if (request.configParams.resource == "contacts") {
    var accountsEndpoint = API_PATHS.accounts + account.Id;
    var accounts = _fetchAPI(accountsEndpoint, token);
    var userFilter = typeof request.configParams.filter === "string" ? request.configParams.filter : "";
    var skip = 0,
      count = 0;

    while (true) {
      var filter = request.configParams.archived ? "" : "Archived eq false"; // if archived checkbox is true return everything, otherwise exclude Archived contacts
      if (request.configParams.membership) {
        // if membership checkbox is true include only members, otherwise return everything
        if (filter.length > 0) {
          filter += " AND ";
        }
        filter += "Member eq true";
      }
      if (filter.length > 0 && userFilter.length > 0) {
        filter += " AND ";
      }
      filter += userFilter;

      var membersEndpoint =
        API_PATHS.accounts +
        account.Id +
        "/Contacts?$async=false&$filter=" +
        filter +
        (request.configParams.countOnly ? "" : "&$skip=" + skip.toString()) +
        (request.configParams.countOnly ? "" : "&$top=" + request.configParams.Paging) +
        (request.configParams.countOnly ? "&$count=true" : "");

      var members = _fetchAPI(membersEndpoint, token); // returns object that contains data from the API call
      console.log(membersEndpoint);
      var n = request.configParams.countOnly ? 1 : members.Contacts.length;
      count += 1;
      console.log(count + " " + n);

      if (request.configParams.countOnly) {
        var row = [];
        selectedDimensionsMetrics.forEach(function(field) {
          switch (field.name) {
            case "Count":
              row.push(members.Count);
              break;
            default:
              row.push(null);
              break;
          }
        });
        rows.push({ values: row }); // final response
        break;
      } else {
        members.Contacts.forEach(function(member) {
          var row = []; // create empty array to hold fields
          selectedDimensionsMetrics.forEach(function(field) {
            switch (field.name) {
              case "AccountIdMain":
                row.push(accounts.Id);
                break;
              case "MemberId":
                row.push(member.Id.toString());
                break;
              case "FirstName":
                if (typeof member.FirstName === "undefined") row.push(null);
                else row.push(member.FirstName);
                break;
              case "LastName":
                if (typeof member.LastName === "undefined") row.push(null);
                else row.push(member.LastName);
                break;
              case "Email":
                if (typeof member.Email === "undefined") row.push(null);
                else row.push(member.Email);
                break;
              case "DisplayName":
                if (typeof member.DisplayName === "undefined") row.push(null);
                else row.push(member.DisplayName);
                break;
              case "Organization":
                if (typeof member.Organization === "undefined") row.push(null);
                row.push(member.Organization);
                break;
              case "MembershipLevelName":
                if (typeof member.MembershipLevel === "undefined") row.push(null);
                else row.push(member.MembershipLevel.Name);
                break;
              case "MembershipLevelId":
                if (typeof member.MembershipLevel === "undefined") row.push(null);
                else row.push(member.MembershipLevel.Id);
                break;
              case "MembershipEnabled":
                row.push(member.MembershipEnabled);
                break;
              case "IsAccountAdministrator":
                if (typeof member.IsAccountAdministrator === "undefined") row.push(null);
                else row.push(member.IsAccountAdministrator);
                break;
              case "Status":
                if (typeof member.MembershipLevel === "undefined") row.push(null);
                else row.push(member.Status);
                break;
              case "TermsOfUseAccepted":
                if (typeof member.TermsOfUseAccepted === "undefined") row.push(null);
                else row.push(member.TermsOfUseAccepted);
                break;
              case "Active":
                if (member.Status == "Active") row.push(true);
                else row.push(false);
                break;
              case "Lapsed":
                if (member.Status == "Lapsed") row.push(true);
                else row.push(false);
                break;
              case "PendingNew":
                if (member.Status == "PendingNew") row.push(true);
                else row.push(false);
                break;
              case "PendingRenewal":
                if (member.Status == "PendingRenewal") row.push(true);
                else row.push(false);
                break;
              case "Groupparticipation":
                var result = "";
                member.FieldValues.forEach(function(e) {
                  if (e.SystemCode === "Groups") {
                    var values = e.Value;
                    for (var j = 0; j < values.length; j++) {
                      var value = values[j].Label;
                      result += (value || null) + ", ";
                    }
                  }
                });
                row.push(result.substring(0, result.length - 2));
                break;
              case "isArchived":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "IsArchived") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                  }
                }
                break;
              case "IsMember":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "IsMember") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "IsSuspendedMember":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "IsSuspendedMember") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "ReceiveEventReminders":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "ReceiveEventReminders") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "ReceiveNewsletters":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "ReceiveEventReminders") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "EmailDisabled":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "EmailDisabled") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "ReceivingEmailsDisabled":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "RecievingEMailsDisabled") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                    break;
                  }
                }
                break;
              case "Balance":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "Balance") {
                    row.push(member.FieldValues[i].Value);
                    break;
                  }
                }
                break;
              case "TotalDonated":
                var totalD = 0;
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "TotalDonated") {
                    totalD = element.Value;
                  }
                });
                row.push(totalD);
                break;
              case "LastUpdated":
                var lastU = undefined;
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "LastUpdated") {
                    lastU = element.Value;
                  }
                });
                row.push(lastU);
                break;
              case "LastUpdatedBy":
                var lastUB = undefined;
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "LastUpdatedBy") {
                    lastUB = element.Value;
                  }
                });
                row.push(lastUB);
                break;
              case "CreationDate":
                var creationD = "";
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "CreationDate") {
                    creationD = element.Value;
                  }
                });
                row.push(creationD);
                break;
              case "LastLoginDate":
                var lastLD = "";
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "LastLoginDate") {
                    lastLD = element.Value;
                  }
                });
                row.push(lastLD);
                break;
              case "AdminRole":
                var adminR = "Not An Account Administrator";
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "AdminRole") {
                    if (element.Value.length != 0) {
                      adminR = "Account Administrator (Full Access)";
                    }
                  }
                });
                row.push(adminR);
                break;
              case "Notes":
                var notes = "";
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "Notes") {
                    notes = element.Value;
                  }
                });
                row.push(notes);
                break;
              case "Phone":
                var phone = "";
                member.FieldValues.forEach(function(element) {
                  if (element.SystemCode == "Phone") {
                    phone = element.Value;
                  }
                });
                row.push(phone);
                break;
              case "IsEventAttendee":
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "IsEventAttendee") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                  }
                }
                break;
              case "IsDonor": {
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "IsDonor") {
                    if (member.FieldValues[i].Value == true) row.push(true);
                    else row.push(false);
                  }
                }
                break;
              }
              case "MemberSince": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode === "MemberSince") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "RenewalDue": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode === "RenewalDue") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "RenewalDateLastChanged": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode === "RenewalDateLastChanged") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "LevelLastChanged": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode === "LevelLastChanged") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "AccessToProfileByOthers": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "AccessToProfileByOthers") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "MemberBundleIdOrEmail": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "BundleId") {
                    value = member.FieldValues[i].Value;
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "MemberRole": {
                var value = "";
                for (var i = 0; i < member.FieldValues.length; i++) {
                  if (member.FieldValues[i].SystemCode == "MemberRole") {
                    value = member.FieldValues[i].Value || "";
                    break;
                  }
                }
                row.push(value);
                break;
              }
              case "Count":
                row.push(null);
                break;
              default:
                break;
            }
          });
          rows.push({ values: row }); // final response
        }); // Since we are iterating, then every possible field for the endpoint will be pushed to row list.

        skip += Number(request.configParams.Paging);
        if (n < Number(request.configParams.Paging)) {
          break;
        }
      }
    }
    console.log("Number of API used: " + count);
  } else if (request.configParams.resource == "membershipLevels") {
    var accountsEndpoint = API_PATHS.accounts + account.Id;
    var accounts = _fetchAPI(accountsEndpoint, token);
    var membershipLevelsEndpoint = API_PATHS.accounts + account.Id + "/membershipLevels";
    var membershipLevels = _fetchAPI(membershipLevelsEndpoint, token);
    membershipLevels.forEach(function(memberLevel) {
      var row = [];
      selectedDimensionsMetrics.forEach(function(field) {
        switch (field.name) {
          case "AccountIdMain1":
            row.push(accounts.Id);
            break;
          case "Id":
            if (typeof memberLevel.Id === "undefined") row.push(null);
            else row.push(memberLevel.Id);
            break;
          case "Name":
            if (typeof memberLevel.Name === "undefined") row.push(null);
            else row.push(memberLevel.Name);
            break;
          case "MembershipFee":
            if (typeof memberLevel.MembershipFee === "undefined") row.push(null);
            else row.push(memberLevel.MembershipFee);
            break;
          case "Description":
            if (typeof memberLevel.Description === "undefined") row.push(null);
            else row.push(memberLevel.Description);
            break;
          case "MembershipType":
            if (typeof memberLevel.Type === "undefined") row.push(null);
            else row.push(memberLevel.Type);
          default:
        }
      });
      rows.push({ values: row });
    });
  } else if (request.configParams.resource == "event") {
    var skip = 0,
      count = 0;
    var accountsEndpoint = API_PATHS.accounts + account.Id;
    var accounts = _fetchAPI(accountsEndpoint, token);
    var userFilter = typeof request.configParams.filter === "string" ? request.configParams.filter : "";

    while (true) {
      var eventsEndpoint =
        API_PATHS.accounts +
        account.Id +
        "/events?$skip=" +
        skip.toString() +
        "&$top=" +
        request.configParams.Paging +
        "&$filter=" +
        userFilter;
      var events = _fetchAPI(eventsEndpoint, token);
      events.Events.forEach(function(event) {
        var row = [];
        selectedDimensionsMetrics.forEach(function(field) {
          switch (field.name) {
            case "AccountIdMain2":
              row.push(accounts.Id);
              break;
            case "Id":
              if (typeof event.Id === "undefined") row.push(null);
              else row.push(event.Id);
              break;
            case "Name":
              if (typeof event.Name === "undefined") row.push(null);
              else row.push(event.Name);
              break;
            case "StartDate":
              if (typeof event.StartDate === "undefined") row.push(null);
              else row.push(event.StartDate);
              break;
            case "EndDate":
              if (typeof event.EndDate === "undefined") row.push(null);
              else row.push(event.EndDate);
              break;
            case "Location":
              if (typeof event.Location === "undefined") row.push(null);
              else row.push(event.Location);
              break;
            case "Tags":
              if (typeof event.Tags === "undefined" || event.Tags.length == 0) {
                row.push(null);
              } else {
                var input = "";
                for (var j in event.Tags) {
                  if (input == "") {
                    input = event.Tags[j];
                  } else {
                    input = input + ", " + event.Tags[j];
                  }
                }
                row.push(input);
              }
              break;
            case "PendingRegistrationsCount":
              if (typeof event.PendingRegistrationsCount === "undefined") row.push(null);
              else row.push(event.PendingRegistrationsCount);
              break;
            case "ConfirmedRegistrationsCount":
              if (typeof event.ConfirmedRegistrationsCount === "undefined") row.push(null);
              else row.push(event.ConfirmedRegistrationsCount);
              break;
            case "CheckedInAttendeesNumber":
              if (typeof event.CheckedInAttendeesNumber === "undefined") row.push(null);
              else row.push(event.CheckedInAttendeesNumber);
              break;
            default:
          }
        });
        rows.push({ values: row });
      });

      skip += Number(request.configParams.Paging);
      if (events.Events.length < Number(request.configParams.Paging)) {
        break;
      }
    }
  } else if (request.configParams.resource == "auditLog") {
    var skip = 0,
      count = 0;
    var startDate = request.dateRange.startDate,
      endDate = request.dateRange.endDate;
    var accountsEndpoint = API_PATHS.accounts + account.Id;
    var accounts = _fetchAPI(accountsEndpoint, token);

    while (true) {
      var auditLogEndpoint =
        API_PATHS.accounts +
        account.Id +
        "/auditLogItems/?StartDate=" +
        startDate +
        "&EndDate=" +
        endDate +
        "&$skip=" +
        skip.toString() +
        "&$top=" +
        request.configParams.Paging;

      var auditLogItems = _fetchAPI(auditLogEndpoint, token);
      auditLogItems.Items.forEach(function(AuditItem) {
        var row = [];
        selectedDimensionsMetrics.forEach(function(field) {
          switch (field.name) {
            case "AccountIdMain3":
              row.push(accounts.Id);
              break;
            case "ContactId":
              if (typeof AuditItem.Contact === "undefined") row.push(null);
              else row.push(AuditItem.Contact.Id);
              break;
            case "Timestamp":
              if (typeof AuditItem.Contact === "undefined") row.push(null);
              else row.push(AuditItem.Timestamp);
              break;
            case "FirstName":
              if (typeof AuditItem.FirstName === "undefined") row.push(null);
              else row.push(AuditItem.FirstName);
              break;
            case "LastName":
              if (typeof AuditItem.LastName === "undefined") row.push(null);
              else row.push(AuditItem.LastName);
              break;
            case "Organization":
              if (typeof AuditItem.Organization === "undefined" || !AuditItem.Organization) row.push("N/A");
              else row.push(AuditItem.Organization);
              break;
            case "Email":
              if (typeof AuditItem.Email === "undefined") row.push(null);
              else row.push(AuditItem.Email);
              break;
            case "Message":
              if (typeof AuditItem.Message === "undefined") row.push(null);
              else row.push(AuditItem.Message);
              break;
            case "AuditLogId":
              if (typeof AuditItem.Message === "undefined") row.push(null);
              else row.push(AuditItem.Id);
              break;
            default:
          }
        });
        rows.push({ values: row });
      });

      skip += Number(request.configParams.Paging);
      if (auditLogItems.Items.length < Number(request.configParams.Paging)) {
        break;
      }
    }
  } else if (request.configParams.resource == "invoices") {
    var skip = 0,
      count = 0;

    while (true) {
      var accountsEndpoint =
        API_PATHS.accounts +
        account.Id +
        "/invoices?unpaidOnly=false&idsOnly=false&StartDate=" +
        request.dateRange.startDate +
        "&EndDate=" +
        request.dateRange.endDate +
        "&includeVoided=" +
        (request.configParams.includeVoided ? "true" : "false") +
        "&$skip=" +
        skip +
        "&$top=" +
        request.configParams.Paging;
      var invoices = _fetchAPI(accountsEndpoint, token);

      invoices.Invoices.forEach(function(invoice) {
        var row = [];
        selectedDimensionsMetrics.forEach(function(field) {
          switch (field.name) {
            case "AccountIdMain4":
              row.push(invoice.Id);
              break;
            case "Id":
              if (typeof invoice.DocumentNumber === "undefined") row.push(null);
              else row.push(invoice.DocumentNumber);
              break;
            case "Url":
              if (typeof invoice.Url === "undefined") row.push(null);
              else row.push(invoice.Url);
              break;
            case "IsPaid":
              row.push(invoice.IsPaid);
              break;
            case "PaidAmount":
              if (typeof invoice.PaidAmount === "undefined" || !invoice.PaidAmount) row.push(null);
              else row.push(invoice.PaidAmount);
              break;
            case "ContactId":
              if (typeof invoice.Contact === "undefined") row.push(null);
              else row.push(invoice.Contact.Id);
              break;
            case "CreatedDate":
              if (typeof invoice.CreatedDate === "undefined") row.push(null);
              else row.push(invoice.CreatedDate);
              break;
            case "OrderType":
              row.push(invoice.OrderType);
              break;
            case "PublicMemo":
              row.push(convertToNullString(invoice.PublicMemo));
              break;
            case "Memo":
              row.push(convertToNullString(invoice.Memo));
              break;
            case "ContactName":
              row.push(invoice.Contact.Name);
              break;
            case "Value":
              row.push(invoice.Value);
              break;
            case "EventId":
              if (invoice.OrderType === "EventRegistration" && "EventRegistration" in invoice) {
                var eventRegistrationEndpoint = API_PATHS.accounts + account.Id + "/eventregistrations/" + invoice.EventRegistration.Id;
                var eventRegistration = _fetchAPI(eventRegistrationEndpoint, token);
                row.push(eventRegistration.Event.Id);
              } else {
                row.push(null);
              }
              break;
            default:
          }
        });
        rows.push({ values: row });
      });

      skip += Number(request.configParams.Paging);
      if (invoices.Invoices.length < Number(request.configParams.Paging)) {
        break;
      }
    }
  } else if (request.configParams.resource == "custom") {
    var skip = 0,
      count = 0;
    while (true) {
      var filter = request.configParams.archived ? "" : "Archived eq false"; // if archived checkbox is true return everything, otherwise exclude Archived contacts
      if (request.configParams.membership) {
        // if membership checkbox is true include only members, otherwise return everything
        if (filter.length > 0) {
          filter += " AND ";
        }
        filter += "Member eq true";
      }

      var membersEndpoint =
        API_PATHS.accounts +
        account.Id +
        "/Contacts?$async=false&" +
        filter +
        "&$skip=" +
        skip.toString() +
        "&$top=" +
        request.configParams.Paging;
      var members = _fetchAPI(membersEndpoint, token); // returns object that contains data from the API call
      var n = members.Contacts.length;
      count += 1;
      console.log(count + " " + n);
      members.Contacts.forEach(function(member) {
        var row = [],
          field_names = []; // formatted field names
        field_names.push("AccountId");
        for (var i = 0; i < member.FieldValues.length; i++) {
          field_names.push(format_field(member.FieldValues[i].FieldName));
        }
        //            console.log(field_names);

        for (var i = 0; i < selectedDimensionsMetrics.length; i++) {
          if (field_names.indexOf(selectedDimensionsMetrics[i].name) <= -1) {
            row.push(null);
          } else if (selectedDimensionsMetrics[i].name == "AccountId") {
            row.push(account.Id);
          } else {
            for (var j = 0; j < member.FieldValues.length; j++) {
              if (format_field(member.FieldValues[j].FieldName) == selectedDimensionsMetrics[i].name) {
                //                    console.log("field type:", field_maps[format_field(member.FieldValues[j].FieldName)])
                //                    console.log("field name type:", member.FieldValues[j].FieldName);
                //                    console.log(map_val(field_maps[format_field(member.FieldValues[j].FieldName)], member,j));
                if (format_field(member.FieldValues[j].FieldName) == "UserID") {
                  console.log("field type:", field_maps[format_field(member.FieldValues[j].FieldName)]);
                }
                row.push(map_val(field_maps[format_field(member.FieldValues[j].FieldName)], member, j));
                break;
              }
            }
          }
        }
        rows.push({ values: row });
      }); // Since we are iterating, then every possible field for the endpoint will be pushed to row list.

      skip += Number(request.configParams.Paging);
      if (n < Number(request.configParams.Paging)) {
        break;
      } // exit when reached the end
      console.log("Number of apis used: " + count);
    }
  } else if (request.configParams.resource == "sentEmails") {
    var userFilter = typeof request.configParams.filter === "string" ? request.configParams.filter : "";
    var skip = 0,
      count = 0;

    while (true) {
      var sentEmailsEndpoint =
        API_PATHS.accounts + account.Id + "/sentemails?$skip=" + skip + "&$top=" + request.configParams.Paging + "&$filter=" + userFilter;
      var emails = _fetchAPI(sentEmailsEndpoint, token);

      emails.Emails.forEach(function(email) {
        var row = [];
        selectedDimensionsMetrics.forEach(function(field) {
          switch (field.name) {
            case "Id":
              row.push(email.Id);
              break;
            case "Url":
              if (typeof email.Url === "undefined") row.push(null);
              else row.push(email.Url);
              break;
            case "SentDate":
              if (typeof email.SentDate === "undefined") row.push(null);
              else row.push(email.SentDate);
              break;
            case "Subject":
              if (typeof email.Subject === "undefined") row.push(null);
              else row.push(email.Subject);
              break;
            case "ReplyToName":
              if (typeof email.ReplyToName === "undefined") row.push(null);
              else row.push(email.ReplyToName);
              break;
            case "ReplyToAddress":
              if (typeof email.ReplyToAddress === "undefined") row.push(null);
              else row.push(email.ReplyToAddress);
              break;
            case "EmailType":
              if (typeof email.Type === "undefined") row.push(null);
              else row.push(email.Type);
              break;
            case "IsTrackingAllowed":
              if (typeof email.IsTrackingAllowed === "undefined") row.push(null);
              else row.push(email.IsTrackingAllowed);
              break;
            case "IsCopySentToAdmins":
              if (typeof email.IsCopySentToAdmins === "undefined") row.push(null);
              else row.push(email.IsCopySentToAdmins);
              break;
            case "SenderId":
              row.push(email.SenderId);
              break;
            case "SenderName":
              if (typeof email.SenderName === "undefined") row.push(null);
              else row.push(email.SenderName);
              break;
            case "SendingType":
              if (typeof email.SendingType === "undefined") row.push(null);
              else row.push(email.SendingType);
              break;
            case "RecipientCount":
              row.push(email.RecipientCount);
              break;
            case "ReadCount":
              row.push(email.ReadCount);
              break;
            case "UniqueLinkClickCount":
              row.push(email.UniqueLinkClickCount);
              break;
            case "SuccessfullySentCount":
              row.push(email.SuccessfullySentCount);
              break;
            case "RecipientsThatClickedAnyLinkCount":
              row.push(email.RecipientsThatClickedAnyLinkCount);
              break;
            case "FailedCount":
              row.push(email.FailedCount);
              break;
            case "InProgress":
              if (typeof email.InProgress === "undefined") row.push(null);
              else row.push(email.InProgress);
              break;
            case "RecipientType":
              var value = email.Recipient !== null ? email.Recipient.Type : null;
              row.push(value);
              break;
            case "RecipientName":
              var value = email.Recipient !== null ? email.Recipient.Name : null;
              row.push(value);
              break;
            case "RecipientId":
              var value = email.Recipient !== null ? email.Recipient.Id : null;
              row.push(value);
              break;
            case "RecipientEmail":
              var value = email.Recipient !== null ? email.Recipient.Email : null;
              row.push(value);
              break;
            default:
          }
        });
        rows.push({ values: row });
      });

      skip += Number(request.configParams.Paging);
      if (emails.Emails.length < Number(request.configParams.Paging)) {
        break;
      }
    }
  }

  return {
    schema: selectedDimensionsMetrics,
    rows: rows
  };
};

// Format date to meet GDS requirement.
function format_date(d_in) {
  return d_in.substr(0, d_in.indexOf("T"));
}

// Function to account for nested structure in Wild Apricot JSON response format.
function map_val(ft_in, member_in, idx) {
  // Base case, function in development.
  if (
    typeof member_in.FieldValues[idx].Value === "undefined" ||
    member_in.FieldValues[idx].Value == "" ||
    member_in.FieldValues[idx].Value == null
  )
    return null;
  switch (ft_in) {
    case "ID":
      return member_in.FieldValues[idx].Value ? member_in.FieldValues[idx].Value : null;
    case "Dropdown":
      return member_in.FieldValues[idx].Value.Label ? member_in.FieldValues[idx].Value.Label : null;
    case "Picture":
      return member_in.FieldValues[idx].Value.Url ? member_in.FieldValues[idx].Value.Url : null;
    case "RadioButtonsWithExtraCharge":
      return member_in.FieldValues[idx].Value.Label ? member_in.FieldValues[idx].Value.Label : null;
    case "MultipleChoice":
      result = "";
      if (member_in.FieldValues[idx].Value.length > 0) {
        // comma delimited
        no_comma_idx = member_in.FieldValues[idx].Value.length - 1;
        for (var i = 0; i < member_in.FieldValues[idx].Value.length; i++) {
          result += member_in.FieldValues[idx].Value[i]["Label"];
          result += i == no_comma_idx ? "" : ", "; // Avoid adding comma for the last item
        }
      }
      return member_in.FieldValues[idx].Value.length > 0 ? result : null;
    case "MultipleChoiceWithExtraCharge":
      result = "";
      if (member_in.FieldValues[idx].Value.length > 0) {
        // comma delimited
        no_comma_idx = member_in.FieldValues[idx].Value.length - 1;
        for (var i = 0; i < member_in.FieldValues[idx].Value.length; i++) {
          result += member_in.FieldValues[idx].Value[i]["Label"];
          result += i == no_comma_idx ? "" : ", "; // Avoid adding comma for the last item
        }
      }
      return member_in.FieldValues[idx].Value.length > 0 ? result : null;
    case "RadioButtons":
      return member_in.FieldValues[idx].Value.Label ? member_in.FieldValues[idx].Value.Label : null;
    case "Date":
      return format_date(member_in.FieldValues[idx].Value);
    default:
      // Text, RulesAndTerms(Boolean), MultilineText, MultipleChoiceWithExtraCharge, ExtraChargeCalculations
      if (typeof member_in.FieldValues[idx].Value === "undefined") {
        return null;
      }
      return member_in.FieldValues[idx].Value.Label ? member_in.FieldValues[idx].Value.Label : member_in.FieldValues[idx].Value;
  }
}

function convertToNullString(string) {
  if (typeof string === "string") {
    if (string === "") {
      string = null;
    }
  }
  return string;
}

function _getAccessToken(apikey) {
  try {
    apikey = (apikey || "").trim();
    var scopeNames = "auto";

    var authRequestParams = {
      method: "POST",
      headers: {
        Authorization: "Basic " + Utilities.base64Encode("APIKEY" + ":" + apikey)
      },
      contentType: "application/x-www-form-urlencoded",
      payload: Utilities.formatString("grant_type=%s&scope=%s", "client_credentials", scopeNames)
    };

    var tokenJSON = UrlFetchApp.fetch(API_PATHS.auth, authRequestParams);
    var tokenData = JSON.parse(tokenJSON);

    return tokenData.access_token;
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText("DBG: Failed to get token by API key:" + e)
      .setText("Wild Apricot API key is not valid. Please edit datasource and provide valid API key.")
      .throwException();
  }
}

function _fetchAPI(url, token) {
  // HTTP request
  try {
    var requestParams = {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
      accept: "application/json"
    };

    var responseJSON = UrlFetchApp.fetch(url, requestParams); // request Params in order to fetch from API
    return JSON.parse(responseJSON); // returns back from request, parses into Javascript object, ready to be used
    //    console.log(responseJSON);
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText("DBG: Failed to fetch data from API: " + e)
      .setText("Wild Apricot API returned an error: " + e)
      .throwException();
  }
}

function _filterSelectedItems(schema, selectedFields) {
  var dimensionsAndMetrics = [];
  selectedFields.forEach(function(field) {
    for (var i = 0; i < schema.length; i++) {
      if (schema[i].name === field.name) {
        dimensionsAndMetrics.push(schema[i]);
        break;
      }
    }
  });
  return dimensionsAndMetrics;
}

////////////////////////// OLD AUTH //////////////////////////////
/*
function getAuthType() {
  var response = {
    type: "OAuth2"
  };
  return response;
}
*/

/////////////////////////// NEW AUTH /////////////////////////////////
/**
 * Gets the OAuth2 Auth type.
 * @return {object} The Auth type.
 */
wa_connector.getAuthType = function() {
  var cc = DataStudioApp.createCommunityConnector();
  return cc
    .newAuthTypeResponse()
    .setAuthType(cc.AuthType.KEY)
    .setHelpUrl("https://www.example.org/connector-auth-help")
    .build();
};

/**
 * Resets the auth service.
 */
function resetAuth() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty("dscc.key");
}

/**
 * Returns true if the auth service has access.
 * @return {boolean} True if the auth service has access.
 */
function isAuthValid() {
  var userProperties = PropertiesService.getUserProperties();
  var key = userProperties.getProperty("dscc.key");
  // This assumes you have a validateKey function that can validate if the key is valid.
  //return validateKey(key);
  return true;
}

/**
 * Sets the credentials.
 * @param {Request} request The set credentials request.
 * @return {object} An object with an errorCode.
 */
function setCredentials(request) {
  var key = request.configParams.apikey;

  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("dscc.key", key);
  return {
    errorCode: "NONE"
  };
}

////////////////////////////////////////////////////////////////////////

function isAdminUser() {
  return true;
}

////////////////////////////////////////////////////////////////////////
// STACKDRIVER LOGGING API CALLS //
////////////////////////////////////////////////////////////////////////

logEnabled = true; // Do you want logging to be enabled?

wa_connector.stackDriverLogging = function(functionName, parameter) {
  if (logEnabled) {
    var paramString = JSON.stringify(parameter, null, 2); // creates a JSON string of the return from API
    //    console.log([functionName, 'request', paramString]); // logs as a JSON object
  }

  var returnObject = wa_connector[functionName](parameter);

  if (logEnabled) {
    var returnString = JSON.stringify(returnObject, null, 2);
    //    console.log([functionName, 'response', returnString]);
  }

  return returnObject;
};
