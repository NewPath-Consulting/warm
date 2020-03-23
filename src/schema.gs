// ------------------------------------------------------------------------------------------------------------------
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

var WASchema = {
  account: [
    {
      name: "Id",
      label: "Account ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "PrimaryDomainName",
      label: "Account Domain",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "URL"
      }
    },
    {
      name: "Name",
      label: "Account Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ],
  // previously members
  contacts: [
    {
      name: "MemberId",
      label: "User Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Groupparticipation",
      label: "Group Participation",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "AccountIdMain",
      label: "Account Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "FirstName",
      label: "First Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "LastName",
      label: "Last Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "Email",
      label: "Email",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "DisplayName",
      label: "Display Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Organization",
      label: "Organization",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "MembershipLevelName",
      label: "Membership Level Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "MembershipLevelId",
      label: "Membership Level Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "MembershipEnabled",
      label: "Membership Enabled",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsAccountAdministrator",
      label: "Admin",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "Status",
      label: "Status",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "TermsOfUseAccepted",
      label: "TermsOfUseAccepted",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "Active",
      label: "IsActiveMember",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "Lapsed",
      label: "IsLapsedMember",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "PendingNew",
      label: "IsPendingNewMember",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "PendingRenewal",
      label: "IsPendingRenewalMember",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "isArchived",
      label: "isArchived",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsDonor",
      label: "Donor",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsEventAttendee",
      label: "Event registrant",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsMember",
      label: "Member",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsSuspendedMember",
      label: "Suspended member",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "ReceiveEventReminders",
      label: "Event announcements",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "ReceiveNewsletters",
      label: "Member emails and newsletters",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "EmailDisabled",
      label: "Email delivery disabled",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "ReceivingEmailsDisabled",
      label: "Receiving emails disabled",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "Balance",
      label: "Balance",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "TotalDonated",
      label: "Total donated",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "LastUpdated",
      label: "Profile last updated",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "LastUpdatedBy",
      label: "Profile last updated by",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "CreationDate",
      label: "Creation date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "LastLoginDate",
      label: "Last login date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "AdminRole",
      label: "Administrator role",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Notes",
      label: "Notes",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Phone",
      label: "Phone",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "MemberSince",
      label: "Member since",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "RenewalDue",
      label: "Renewal due",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "RenewalDateLastChanged",
      label: "Renewal date last changed",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "LevelLastChanged",
      label: "Level last changed",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "AccessToProfileByOthers",
      label: "Access to profile by others",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "MemberBundleIdOrEmail",
      label: "Member bundle id or email",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "MemberRole",
      label: "Member role",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Count",
      label: "Count",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ],
  membershipLevels: [
    {
      name: "AccountIdMain1",
      label: "Account Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Id",
      label: "Membership Level Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Name",
      label: "Membership Level Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "MembershipFee",
      label: "Membership Fee",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "Description",
      label: "Level Description",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "MembershipType",
      label: "Membership Type",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    }
  ],
  event: [
    {
      name: "AccountIdMain2",
      label: "Account Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Id",
      label: "Event ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Name",
      label: "Event Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "StartDate",
      label: "Start Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "EndDate",
      label: "End Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "Location",
      label: "Event Location",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Tags",
      label: "Event Tags",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "PendingRegistrationsCount",
      label: "Number of Pending Registrations",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC"
      }
    },
    {
      name: "ConfirmedRegistrationsCount",
      label: "Number of Confirmed Registrations",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC"
      }
    },
    {
      name: "CheckedInAttendeesNumber",
      label: "Number of checked-in attendees",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC"
      }
    }
  ],
  auditLog: [
    {
      name: "AuditLogId",
      label: "Audit Log Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "AccountIdMain3",
      label: "Account ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Timestamp",
      label: "Audit Log Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "ContactId",
      label: "User ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "FirstName",
      label: "First Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "LastName",
      label: "Last Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "Organization",
      label: "Organization",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Email",
      label: "Email",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "Message",
      label: "Message",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ],
  invoices: [
    {
      name: "AccountIdMain4",
      label: "Account ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Id",
      label: "Invoice Number",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Url",
      label: "Invoice Url",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "TEXT"
      }
    },
    {
      name: "IsPaid",
      label: "Paid",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "PaidAmount",
      label: "Paid Amount",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "ContactId",
      label: "User Id",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "CreatedDate",
      label: "Invoice Created Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "OrderType",
      label: "Origin",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "PublicMemo",
      label: "Comments for payer",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Memo",
      label: "Internal notes",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "ContactName",
      label: "Invoiced to",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Value",
      label: "Total Amount",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "EventId",
      label: "Event ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ],
  sentEmails: [
    {
      name: "Id",
      label: "Email ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Url",
      label: "Url",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "URL"
      }
    },
    {
      name: "SentDate",
      label: "Sent date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "Subject",
      label: "Subject",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "ReplyToName",
      label: "Replier name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "ReplyToAddress",
      label: "Replier email address",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "EmailType",
      label: "Type",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "IsTrackingAllowed",
      label: "Is tracking allowed",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "IsCopySentToAdmins",
      label: "Is copy sent to admin",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION",
        semanticType: "BOOLEAN"
      }
    },
    {
      name: "SenderId",
      label: "Sender ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "SenderName",
      label: "Sender name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "SendingType",
      label: "Sending type",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientCount",
      label: "Number of recipients",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "ReadCount",
      label: "Times read",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "UniqueLinkClickCount",
      label: "Number of unique links",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "SuccessfullySentCount",
      label: "Number of succesful sends",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientsThatClickedAnyLinkCount",
      label: "Recipients that clicked a link",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "FailedCount",
      label: "Number of failed sends",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "InProgress",
      label: "Is in progress",
      dataType: "BOOLEAN",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientType",
      label: "Recipient type",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientName",
      label: "Recipient name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientId",
      label: "Recipient ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "RecipientEmail",
      label: "Recipient email",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ],
  payments: [
    {
      name: "Id",
      label: "Payment ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Value",
      label: "Payment Amount",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "RefundedAmount",
      label: "Refunded Amount",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "ContactId",
      label: "User ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "ContactName",
      label: "Contact Name",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "CreatedDate",
      label: "Payment Created Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "UpdatedDate",
      label: "Payment Updated Date",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION",
        semanticGroup: "DATE_AND_TIME",
        semanticType: "YEAR_MONTH_DAY_HOUR"
      }
    },
    {
      name: "TenderName",
      label: "Tender",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "Comment",
      label: "Internal Comment",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "PublicComment",
      label: "Public Comment",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "AllocatedValue",
      label: "Allocated Value",
      dataType: "NUMBER",
      semantics: {
        conceptType: "METRIC",
        semanticGroup: "CURRENCY",
        semanticType: "CURRENCY_CAD"
      }
    },
    {
      name: "Type",
      label: "Payment Type",
      dataType: "STRING",
      semantics: {
        conceptType: "DIMENSION"
      }
    },
    {
      name: "DonationId",
      label: "Donation ID",
      dataType: "NUMBER",
      semantics: {
        conceptType: "DIMENSION"
      }
    }
  ]
};
