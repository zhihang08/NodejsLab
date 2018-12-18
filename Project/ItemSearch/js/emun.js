
var DomianMapping = {
        DMT_LOGIN : 1,    /*!< (1) Login Message */
        DMT_DIRECTORY : 4,	/*!< (4) Source Directory Message */
        DMT_DICTIONARY : 5,    /*!< (5) Dictionary Message */
        DMT_MARKET_PRICE : 6,    /*!< (6) Market Price Message */
        DMT_MARKET_BY_ORDER : 7,	/*!< (7) Market by Order/Order Book Message */
        DMT_MARKET_BY_PRICE : 8,	/*!< (8) Market by Price/Market Depth Message */
        DMT_MARKET_MAKER : 9,	/*!< (9) Market Maker Message */
        DMT_SYMBOL_LIST : 10,	/*!< (10) Symbol List Messages */
        DMT_SERVICE_PROVIDER_STATUS : 11,	/*!< (11) Service Provider Status Messages */
        DMT_HISTORY : 12,   /*!< (12) History Message */
        DMT_HEADLINE : 13,   /*!< (13) Headline Message */
        DMT_STORY : 14,	/*!< (14) Story Message */
        DMT_REPLAY_HEADLINE : 15,	/*!< (15) Replay Headline Message */
        DMT_REPLAY_STORY : 16,	/*!< (16) Replay Story Message */
        DMT_TRANSACTION : 17,	/*!< (17) Transaction Message */
        DMT_NEWS_2000 : 18,	/*!< (18) News 2000 Headline and Story Message */
        DMT_IDN_TS1 : 19,	/*!< (19) IDN Time Series Message */
        DMT_IDN_TAS : 20,	/*!< (20) IDN Time and Sales Message */
        DMT_IDN_PERMISSIONS : 21,   /*!< (21) IDN Permissions Domain */
        DMT_TIMING_LOG : 23,	/*!< (23) DDS Timing Log Domain */
        DMT_SHELL : 24,	/*!< (24) DDS Shell Instrument Conversion */

    		DMT_SPS_NON_STREAMING : 25,
    		DMT_STATUS_PAGE : 26,
    		DMT_STATUS_CONTRIBUTION : 27,
    		DMT_METADATA : 28,
    		DMT_PROVIDER_ADMIN : 29,
    		DMT_ANALYTICS : 30,
    		DMT_REFERENCE : 31,

    		DMT_NEWS_TEXT_ANALYTICS : 33,
    		DMT_SHELL_OMM_MBP : 126,

        DMT_MAX_RESERVED : 127,	/*!< (127) Maximum reserved domain type value */
        DMT_MAX_VALUE : 32767,/*!< (32767) Maximum value for a domain type */
        // prev ones are defined as trwfTrdmDomainTypes in trwf/trwfTRDM.h
        // next ones are customized
        ////DMT_GDH_SINGLE : 128,	/*!< (128) GDH single domain */
        ////DMT_GDH_MULTIPLE : 129,	/*!< (129) GDH multiple domain */
        DMT_RDH : 130,	/*!< (130) RDH domain */
        DMT_TDH : 150,	/*!< (150) TDH domain */
        DMT_TDH_AC : 151, /*!<  (151) Domain for TDH to source from TS Active Cache */
        DMT_VAH_RESERVED : 255,  /*!< (255) reserved for VAH */

        DMT_EVAI_MASTER_CONFIG : 1000,

    		/***
    		DMT_EVAI_CONFIG		: 1000,
        DMT_EVAI_COMMAND	: 1001,
        DMT_EVAI_STATISTICS : 1002,
        DMT_EVAI_VAAITEMCMD : 1003,
        DMT_EVAI_VAD		: 1010,
        DMT_EVAI_ITEM		: 1011
    		***/
        DMT_DATASYNC_MIN  : 2000,
        DMT_DATASYNC_SYNC  : 2000,
        DMT_DATASYNC_HYBRID_FACTOR  : 2001,
        DMT_DATASYNC_MAX  : 2010
    };

var SerivceIDMapping = {
      "VAI_OUTPUT_DDN" : 0,  //!< Output to Elektron DDN

      "VAI_INTERNAL_VAA" : 100,
      "VAI_INTERNAL_OCI" : 101,
      "VAI_INTERNAL_FMS" : 102,    //!< Service id for FMS
      "VAI_INTERNAL_TIMER" : 103,    //!< Service id for TimerEvent
      "VAI_INTERNAL_CALENDAR" : 104,    //!< Service id for Calendar
      "VAI_INTERNAL_SYSTEM" : 105,    //!< Service id for System
      "VAI_INTERNAL_TEST" : 106,

      "VAI_INPUT_EED"        : 257,      //!< Service provided by Edge Device
      "VAI_INPUT_RDH"        : 400,      //!< Service provided by Reference data handler
      "VAI_INPUT_TDH"        : 500,      //!< Service provided by Time Series data handler
      "VAI_INPUT_IDH"        : 600,      //!< Service provided by ISAT data handler
      "VAI_INPUT_SUPRIC"     : 700,      //!< Service provided by SuperRIC Builder from ECP Derived Store
      "VAI_INPUT_DPA"        : 800,      //!< Service provided by DPA Handler
      "VAI_INPUT_CALCENGINE" : 900,      //!< Service provided by Shared Calculation Engine in PoD
      "VAI_INPUT_PRIVATE"    : 999,      //!< Service provided by Analytic platform in private stream

      "VAI_IA_VACHE_0" : 8000,    //!< service ID for Input from VA-CHE 0 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_1" : 8001,    //!< service ID for Input from VA-CHE 1 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_2" : 8002,    //!< service ID for Input from VA-CHE 2 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_3" : 8003,    //!< service ID for Input from VA-CHE 3 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_4" : 8004,    //!< service ID for Input from VA-CHE 4 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_5" : 8005,    //!< service ID for Input from VA-CHE 5 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_6" : 8006,    //!< service ID for Input from VA-CHE 6 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_7" : 8007,    //!< service ID for Input from VA-CHE 7 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_8" : 8008,    //!< service ID for Input from VA-CHE 8 via DDN(lable id configured in the VAA MasterConfig)
      "VAI_IA_VACHE_9" : 8009,    //!< service ID for Input from VA-CHE 9 via DDN(lable id configured in the VAA MasterConfig)

      //! Below Enums are used for inter-VAA CBR, only used for CreateCbrInputItem
      "VAI_IA_MG_COMMON" : 9000,   //!< To accept all service IDs from inter-VAA common MG(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_0" : 9100,     //!< To accept all service IDs from inter-VAA venue 0(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_1" : 9101,     //!< To accept all service IDs from inter-VAA venue 1(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_2" : 9102,     //!< To accept all service IDs from inter-VAA venue 2(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_3" : 9103,     //!< To accept all service IDs from inter-VAA venue 3(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_4" : 9104,     //!< To accept all service IDs from inter-VAA venue 4(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_5" : 9105,     //!< To accept all service IDs from inter-VAA venue 5(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_6" : 9106,     //!< To accept all service IDs from inter-VAA venue 6(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_7" : 9107,     //!< To accept all service IDs from inter-VAA venue 7(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_8" : 9108,     //!< To accept all service IDs from inter-VAA venue 8(lable id configured in the VAA MasterConfig)
      "VAI_IA_MG_VENUE_9" : 9109,     //!< To accept all service IDs from inter-VAA venue 9(lable id configured in the VAA MasterConfig)

      "VAI_IA_CBR_WILDCARD" : 9998,   //!< Service id for CBR filtering from multicast groups via InputLAN for inter-VAA Communication
      "VAI_IA_CBR_EXPLICIT" : 9999,   //!< A Special CBR case of inter-VAA to explain * and % as explict characters instead of wild card
      //! Below Enums are used to determine service id if in the range of inter-VAA service
      "VAI_INVALID_SERVICE_ID" : 0xFFFF  //65535
  };

var TagMapping = {
      "No Tolerance": "DDN",
      "Item Tolerance": "TOL",
      "Template ": "TTP",
      "Template Tolerance": "TTI"
    };
var SearchTypeMapping = {
    "Tolerance": "DDN",
    "Item": "TOL",
    "Template ": "TTP",
};
var OCIType = {
  "DymamicLimit": "Set_dynamic_limit",
  "ConsecutivePass": "Clear_consecutive_pass",
  "MarketLevel": "Set_market_level"
}

var MinMaxReference = {
  "VAI_OUTPUT_MIN" : 0,
  "VAI_OUTPUT_MAX" : 99,
  "VAI_INTERNAL_MIN" : 100,
  "VAI_INTERNAL_MAX" : 199,
  "VAI_INPUT_MIN"        : 200,
  "VAI_INPUT_MAX"        : 2999,
  "VAI_SERVICE_ID_USER_MIN" : 5000,
  /* Service IDs for VAA customization */
  "VAI_SERVICE_ID_USER_MAX" : 7999,
  //!Below Enums are used for VA-CHE inputs both CreateCbrInputItem and CreateSpecificInputItem
  "VAI_IA_VACHE_MIN" : 8000,      //!< The minimum number of service ID for VA-CHE Input
  "VAI_IA_VACHE_MAX" : 8099,      //!< The maximum number of service ID for VA-CHE Input
  "VAI_IA_MG_VENUE_MIN" : 9100,   //!< To accept all service IDs from inter-VAA first multicast group
  "VAI_IA_MG_VENUE_MAX" : 9199,   //!< To accept all service IDs from inter-VAA fourth venue multicast group
  "VAI_IA_SERVICE_MIN" : 10000,
  "VAI_IA_OUTPUT_SERVICE_MAX" : 29999,  //!< The maximum number of service ID for inter-VAA output item
  "VAI_IA_INPUT_SERVICE_MIN" : 30000,  //!< The minimum number of service ID for inter-VAA input item
  "VAI_IA_INPUT_SERVICE_MAX" : 49999,  //!< The maximum number of service ID for inter-VAA input item
  "VAI_IA_SERVICE_MAX" : "VAI_IA_INPUT_SERVICE_MAX",
  "VAI_IA_OUTPUT_SERVICE_MIN" : "VAI_IA_SERVICE_MIN",  //!< The minimum number of service ID for inter-VAA output item
}

var OutPutMode = {
      0: "ENABLED",
      1: "DISABLED"
    };

var InputMode = {
      0: "STREAMING",
      1: "SNAPSHOT"
    };

var Data_State = {
      0: "UNSPECIFIED",
      1: "OK",
      2: "SUSPECT"
    };
