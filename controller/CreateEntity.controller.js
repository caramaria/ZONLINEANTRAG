sap.ui.define(["de/stadt-koeln/onlineantrag/OnlineAntragCRUD/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox",
	"de/stadt-koeln/onlineantrag/OnlineAntragCRUD/model/formatter", "sap/m/UploadCollectionParameter", "sap/m/MessageToast",
	"de/stadt-koeln/onlineantrag/OnlineAntragCRUD/controller/Validator", "sap/ui/model/SimpleType", "sap/ui/model/ValidateException",
	"sap/ui/core/IntervalTrigger"
], function (BaseController, JSONModel, MessageBox, formatter, UploadCollectionParameter, MessageToast, Validator, SimpleType,
	ValidateException, IntervalTrigger) {
	"use strict";
	return BaseController.extend("de.stadt-koeln.onlineantrag.OnlineAntragCRUD.controller.CreateEntity", {
		formatter: formatter,
		_oBinding: {},
		onInit: function () {
			var e = this;
			this.getRouter().getTargets().getTarget("create").attachDisplay(null, this._onDisplay, this);
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();
			this._oViewModel = new JSONModel({
				enableCreate: false,
				delay: 0,
				busy: false,
				mode: "create",
				viewTitle: ""
			});
			this.setModel(this._oViewModel, "viewModel");
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var t = sap.ui.getCore().getMessageManager().getMessageModel();
			this._oBinding = new sap.ui.model.Binding(t, "/", t.getContext("/"));
			this._oBinding.attachChange(function (t) {
				var a = t.getSource().getModel().getData();
				for (var i = 0; i < a.length; i++) {
					if (a[i].type === "Error" && !a[i].technical) {
						e._oViewModel.setProperty("/enableCreate", false);
					}
				}
			});
			this._oPopover1 = this._createPopover("1");
			this._oPopover2 = this._createPopover("2");
			this._oPopover3 = this._createPopover("3");
			this._oPopover4 = this._createPopover("4");
			this._oPopover5 = this._createPopover("5");
			this.byId("UploadCollection")._getFileUploader().setIconFirst(true);
			this.byId("UploadCollection")._getFileUploader().setIconOnly(false);
			this.byId("UploadCollection")._getFileUploader().setButtonText("Anhang hinzufügen");
		},
		_validateForm: function () {
			var e = new Validator;
			var t = [];
			var a = true;
			t.push(this.byId("formAllgemeineAngaben"));
			t.push(this.byId("formOrganisation"));
			t.push(this.byId("formFinanzierung"));
			t.push(this.byId("formZahlung"));
			t.push(this.byId("formProjekt"));
			for (var i = 0; i < t.length; i++) {
				if (e.validate(t[i]) === false) a = false;
			}
			if (!this._validateEmail("Organisation_EMail_id")) a = false;
			if (!this._validateDateFields("Header_Startdate_id")) a = false;
			if (this.byId("changeVeranstaltungRb").getSelectedIndex() === 0) {
				if (!this._validateDateFields("Header_EventStartDate_id")) a = false;
			}
			if (!this._validateTextAreas("Projectdesc")) a = false;
			if (!this._validateRadioButtons("changeAntragstellerRb")) a = false;
			if (!this._validateRadioButtons("changeVeranstaltungRb")) a = false;
			if (!this._validateRadioButtons("changeVeranstaltungsortRb")) a = false;
			if (!this._validateRadioButtons("changeVorsteuerRb")) a = false;
			if (!this._validateCheckBoxes("checkBox1")) a = false;
			if (!this._validateCheckBoxes("checkBox2")) a = false;
			if (!this._validateCheckBoxes("checkBox3")) a = false;
			if (!this._validateCheckBoxes("checkBox4")) a = false;
			if (!this._validateCheckBoxes("checkBox5")) a = false;
			if (!this._validateCheckBoxes("checkBox6")) a = false;
			if (!this._validateCheckBoxes("checkBox7")) a = false;
			if (a) return true;
			else return false;
		},
		_validateCheckBoxes: function (e) {
			var t = this.byId(e);
			if (t.getSelected() === true) {
				t.setValueState(sap.ui.core.ValueState.None);
				return true;
			} else {
				t.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}
		},
		_validateTextAreas: function (e) {
			var t = this.byId(e);
			if (t.getValue().length > 0) {
				t.setValueState(sap.ui.core.ValueState.None);
				return true;
			} else {
				t.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}
		},
		_validateRadioButtons: function (e) {
			var t = this.byId(e);
			var a = t.getButtons();
			var i = false;
			if (t.getProperty("visible") === true) {
				for (var o = 0; o < a.length; o++) {
					if (t.getButtons()[o].getSelected() === true) i = true;
				}
				for (o = 0; o < a.length; o++) {
					if (i) t.getButtons()[o].setValueState(sap.ui.core.ValueState.None);
					else t.getButtons()[o].setValueState(sap.ui.core.ValueState.Error);
				}
			} else i = true;
			if (i) return true;
			else return false;
		},
		_validateEmail: function (e) {
			var t = this.byId(e);
			var a = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			if (t.getEnabled() === true && !t.getValue().match(a)) {
				t.setValueState(sap.ui.core.ValueState.Error);
				t.setValueStateText("Bitte geben Sie ein gültige E-Mail Adresse an.");
				return false;
			} else {
				t.setValueState(sap.ui.core.ValueState.None);
				t.setValueStateText("");
				return true;
			}
		},
		_validateDateFields: function (e) {
			var t = this.byId(e);
			if (t.getDateValue() > 0) {
				t.setValueState(sap.ui.core.ValueState.None);
				t.setValueStateText("");
				return true;
			} else {
				t.setValueState(sap.ui.core.ValueState.Error);
				t.setValueStateText("Bitte geben Sie ein gültiges Datum an.");
				return false;
			}
		},
		onSave: function () {
			if (this._validateForm()) {
				var e = this,
					t = this.getModel(),
					a = this._oViewModel.getProperty("/mode");
				if (!t.hasPendingChanges()) {
					MessageBox.information(this._oResourceBundle.getText("noChangesMessage"), {
						id: "noChangesInfoMessageBox",
						styleClass: e.getOwnerComponent().getContentDensityClass()
					});
					return;
				}
				this.getModel("appView").setProperty("/busy", true);
				if (this._oViewModel.getProperty("/mode") === "edit") {
					t.attachEventOnce("batchRequestCompleted", function (t) {
						if (e._checkIfBatchRequestSucceeded(t)) {
							e._fnUpdateSuccess();
						} else {
							e._fnEntityCreationFailed();
							MessageBox.error(e._oResourceBundle.getText("updateError"));
						}
					});
				} else if (this._oViewModel.getProperty("/mode") === "create") {
					t.attachEventOnce("batchRequestCompleted", function (t) {
						if (e._checkIfBatchRequestSucceeded(t)) {
							e._fnEntityCreated();
						} else {
							e._fnEntityCreationFailed();
						}
					});
				}
				t.submitChanges();
			} else {
				MessageBox.error("Bitte füllen Sie alle Mussfelder aus.");
			}
		},
		onExit: function () {
			if (this._oPopover1) {
				this._oPopover1.destroy();
			}
			if (this._oPopover2) {
				this._oPopover2.destroy();
			}
			if (this._oPopover3) {
				this._oPopover3.destroy();
			}
			if (this._oPopover4) {
				this._oPopover4.destroy();
			}
			if (this._oPopover5) {
				this._oPopover5.destroy();
			}
		},
		_createPopover: function (id) {
			var that = this;
			var oCloseButton = new sap.m.Button({
				text: this.getResourceBundle().getText("PopupCloseWindow"),
				press: function () {
					eval("that._oPopover" + id).close();
				}
			});
			var oPopoverBar = new sap.m.Bar({
				contentMiddle: [new sap.m.Text({
					text: this.getResourceBundle().getText("PopupHelpTitle" + id)
				})]
			});
			var oContent = new sap.m.TextArea({
				growing: true,
				width: "100%",
				editable: false,
				value: this.getResourceBundle().getText("PopupHelpText" + id)
			});
			var oPopover = new sap.m.ResponsivePopover({
				customHeader: oPopoverBar,
				contentWidth: "440px",
				contentHeight: "440px",
				verticalScrolling: false,
				modal: true,
				content: oContent,
				endButton: oCloseButton,
				placement: sap.m.PlacementType.Left
			});
			return oPopover;
		},
		handleHelpPopoverPress: function (e) {
			var t = e.getSource();
			var a = t.getCustomData()[0].getValue();
			if (a === "1") this._oPopover1.openBy(t);
			else if (a === "2") this._oPopover2.openBy(t);
			else if (a === "3") this._oPopover3.openBy(t);
			else if (a === "4") this._oPopover4.openBy(t);
			else if (a === "5") this._oPopover5.openBy(t);
		},
		_checkIfBatchRequestSucceeded: function (e) {
			var t = e.getParameters();
			var a = e.getParameters().requests;
			var i;
			if (t.success) {
				if (a) {
					for (var o = 0; o < a.length; o++) {
						i = e.getParameters().requests[o];
						if (!i.success) {
							return false;
						}
					}
				}
				return true;
			} else {
				return false;
			}
		},
		onCancel: function () {
			if (this.getModel().hasPendingChanges()) {
				this._showConfirmQuitChanges();
			} else {
				this.getModel("appView").setProperty("/addEnabled", true);
				sap.ushell.Container.setDirtyFlag(false);
				this._navBack();
			}
		},
		_navBack: function () {
			this._resetUploadCollectionBinding();
			sap.ushell.Container.setDirtyFlag(false);
			var e = sap.ui.core.routing.History.getInstance(),
				t = e.getPreviousHash();
			this.getView().unbindObject();
			if (t !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().getTargets().display("master");
			}
		},
		_resetUploadCollectionBinding: function () {
			var e = this.byId("UploadCollection");
			var t;
			if (!this._collectionItemId) {
				t = this.byId("UploadCollectionItemId").clone();
			} else {
				t = this._collectionItemId.clone();
			}
			this._collectionItemId = t;
			e.bindAggregation("items", {
				path: "ToAttachment",
				template: t
			});
		},
		_showConfirmQuitChanges: function () {
			var e = this.getOwnerComponent(),
				t = this.getModel();
			var a = this;
			MessageBox.confirm(this._oResourceBundle.getText("confirmCancelMessage"), {
				styleClass: e.getContentDensityClass(),
				onClose: function (e) {
					if (e === sap.m.MessageBox.Action.OK) {
						a.getModel("appView").setProperty("/addEnabled", true);
						t.resetChanges();
						a._navBack();
					}
				}
			});
		},
		_scrollToTop: function () {
			this.getView().byId("ObjectPageLayout").setSelectedSection(this.byId("topSection_id").getId());
		},
		_onEdit: function (e) {
			var t = e.getParameter("data"),
				a = this.getView();
			this._oViewModel.setProperty("/mode", "edit");
			this._oViewModel.setProperty("/enableCreate", false);
			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("editViewTitle"));
			a.bindElement({
				path: t.objectPath
			});
			this._scrollToTop();
			this._setCheckBoxSelection(false);
		},
		_onCreate: function (e) {
			if (e.getParameter("name") && e.getParameter("name") !== "create") {
				this._oViewModel.setProperty("/enableCreate", false);
				this.getRouter().getTargets().detachDisplay(null, this._onDisplay, this);
				this.getView().unbindObject();
				return;
			}
			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("createViewTitle"));
			this._oViewModel.setProperty("/mode", "create");
			var t = this._oODataModel.createEntry("ApplicationSet");
			this.getView().setBindingContext(t);
			this._getContactData();
			this._scrollToTop();
			this._setCheckBoxSelection(false);
			this.byId("Form_Oeffentlicher_Raum_id").setVisible(true);
			this.byId("Form_Oeffentlicher_Raum_Hinweis_id").setVisible(true);
			this.byId("changeVeranstaltungsortRb").setVisible(true);
			this.byId("terminLabelId").setRequired(true);
			this._initFoerderprogrammSelection();
		},
		_setCheckBoxSelection: function (e) {
			this.byId("checkBox1").setSelected(e);
			this.byId("checkBox2").setSelected(e);
			this.byId("checkBox3").setSelected(e);
			this.byId("checkBox4").setSelected(e);
			this.byId("checkBox5").setSelected(e);
			this.byId("checkBox6").setSelected(e);
			this.byId("checkBox7").setSelected(e);
			this.byId("checkBox1").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox2").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox3").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox4").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox5").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox6").setValueState(sap.ui.core.ValueState.None);
			this.byId("checkBox7").setValueState(sap.ui.core.ValueState.None);
		},
		_initFoerderprogrammSelection: function () {
			try {
				var e = this.byId("Select_Foerderprogramm_id");
				var t = e.getSelectedKey();
				this._setModelPropertyValue("/Header/ProgrammId", t);
				var a = e.getSelectedItem().getCustomData()[0].getValue();
				this._updateFoerderprogrammAttachments(a);
			} catch (e) {}
		},
		_validateOnlinecommunication: function () {
			if (this._oViewModel.getProperty("/mode") === "edit") {
				if (this.byId("Notes_Onlinecomm_id").getValue() === "") {} else {
					this._oViewModel.setProperty("/enableCreate", true);
				}
			}
		},
		_validateSaveEnablement: function () {
			sap.ushell.Container.setDirtyFlag(true);
			this._oViewModel.setProperty("/enableCreate", true);
		},
		_checkForErrorMessages: function () {
			var e = this._oBinding.oModel.oData;
			if (e.length > 0) {
				var t = true;
				for (var a = 0; a < e.length; a++) {
					if (e[a].type === "Error" && !e[a].technical) {
						t = false;
						break;
					}
				}
				this._oViewModel.setProperty("/enableCreate", t);
			} else {
				this._oViewModel.setProperty("/enableCreate", true);
			}
		},
		_fnUpdateSuccess: function () {
			var e = this;
			MessageBox.information(this._oResourceBundle.getText("updateSuccess"), {
				styleClass: e.getOwnerComponent().getContentDensityClass(),
				onClose: function (t) {
					if (t === sap.m.MessageBox.Action.OK) {
						e.getModel("appView").setProperty("/busy", false);
						sap.ushell.Container.setDirtyFlag(false);
						e.getView().unbindObject();
						e.getRouter().getTargets().display("master");
					}
				}
			});
		},
		_fnEntityCreated: function (e, t) {
			var a = this;
			MessageBox.information(this._oResourceBundle.getText("createSuccess"), {
				styleClass: a.getOwnerComponent().getContentDensityClass(),
				onClose: function (e) {
					if (e === sap.m.MessageBox.Action.OK) {
						a._resetUploadCollectionBinding();
						sap.ushell.Container.setDirtyFlag(false);
						a.getModel("appView").setProperty("/busy", false);
						a.getRouter().getTargets().display("master");
					}
				}
			});
		},
		_fnEntityCreationFailed: function (e) {
			this.getModel("appView").setProperty("/busy", false);
			this._oViewModel.setProperty("/enableCreate", true);
		},
		_onDisplay: function (e) {
			var t = e.getParameter("data");
			if (t && t.mode === "update") {
				this._onEdit(e);
				var a = this.getView().getBindingContext().getProperty("Guid");
				this._updateAttachments(a);
			} else {
				this._onCreate(e);
			}
			sap.ushell.Container.setDirtyFlag(false);
			var i = sap.ui.getCore().byFieldGroupId("");
			for (var o = 0; o < i.length; o++) {
				try {
					i[o].setValueState(sap.ui.core.ValueState.None);
				} catch (e) {}
			}
		},
		_getFormFields: function (e) {
			var t = [];
			var a = e.getFormContainers()[0].getFormElements();
			var i;
			for (var o = 0; o < a.length; o++) {
				i = a[o].getMetadata().getName();
				if (i === "sap.m.Input" || i === "sap.m.DateTimeInput" || i === "sap.m.CheckBox") {
					t.push({
						control: a[o],
						required: a[o - 1].getRequired && a[o - 1].getRequired()
					});
				}
			}
			return t;
		},
		_setModelPropertyValue: function (e, t) {
			var a = this.getView();
			var i = a.getModel();
			var o = a.getBindingContext();
			var s = o.getPath() + e;
			i.setProperty(s, t);
		},
		getBankNameFromIban: function (e) {
			var t = this.getView();
			var a = t.getModel();
			var i = t.byId("Organisation_Iban_id").getValue();
			var o = "";
			var s = "";
			if (i !== "") {
				a.callFunction("/GetBankdataFromIban", {
					method: "GET",
					urlParameters: {
						Iban: i
					},
					success: function (e, a) {
						var i = a.headers["sap-message"];
						if (!i) {
							o = a.data.GetBankdataFromIban.Bankname;
							s = a.data.GetBankdataFromIban.Swift;
						} else {
							var r = JSON.parse(i);
							MessageBox.error(r.message);
						}
						t.byId("BankName_id").setValue(o);
						t.byId("Organisation_Swift_id").setValue(s);
					},
					error: function (e) {
						t.byId("BankName_id").setValue(o);
						t.byId("Organisation_Swift_id").setValue(s);
					}
				});
			}
		},
		_getContactData: function (e) {
			var t = this.getView();
			var a = t.getModel();
			var i = this;
			a.callFunction("/GetContactData", {
				method: "GET",
				success: function (e, a) {
					t.byId("Contact_FirstName_id").setValue(a.data.GetContactData.FirstName);
					i._setModelPropertyValue("/Contact/Title", a.data.GetContactData.Title);
					t.byId("Contact_TelNumber_id").setValue(a.data.GetContactData.TelNumber);
					t.byId("Contact_TitleTxt_id").setValue(a.data.GetContactData.TitleTxt);
					if (a.data.GetContactData.Birthdate === null) {
						t.byId("Contact_Birthdate_id").setValue("");
					} else {
						t.byId("Contact_Birthdate_id").setValue(new Date(a.data.GetContactData.Birthdate).toLocaleDateString());
					}
					i._setModelPropertyValue("/Contact/TitleAca", a.data.GetContactData.TitleAca);
					i._setModelPropertyValue("/Contact/PartnerNo", a.data.GetContactData.PartnerNo);
					t.byId("Contact_TitleAcaTxt_id").setValue(a.data.GetContactData.TitleAcaTxt);
					t.byId("Contact_Birthplace_id").setValue(a.data.GetContactData.Birthplace);
					t.byId("Contact_City_id").setValue(a.data.GetContactData.City);
					t.byId("Contact_LastName_id").setValue(a.data.GetContactData.LastName);
					t.byId("Contact_MobilNumber_id").setValue(a.data.GetContactData.MobilNumber);
					t.byId("Contact_FaxNumber_id").setValue(a.data.GetContactData.FaxNumber);
					t.byId("Contact_Street_id").setValue(a.data.GetContactData.Street);
					t.byId("Contact_HouseNo_id").setValue(a.data.GetContactData.HouseNo);
					t.byId("Contact_PostlCod1_id").setValue(a.data.GetContactData.PostlCod1);
					t.byId("Contact_EMail_id").setValue(a.data.GetContactData.EMail);
				},
				error: function (e) {
					t.byId("Contact_FirstName_id").setValue("");
					t.byId("Contact_TelNumber_id").setValue("");
					t.byId("Contact_Title_id").setValue("");
					t.byId("Contact_Birthdate_id").setValue("");
					t.byId("Contact_TitleAcaTxt_id").setValue("");
					t.byId("Contact_Birthplace_id").setValue("");
					t.byId("Contact_City_id").setValue("");
					t.byId("Contact_LastName_id").setValue("");
					t.byId("Contact_MobilNumber_id").setValue("");
					t.byId("Contact_FaxNumber_id").setValue("");
					t.byId("Contact_Street_id").setValue("");
					t.byId("Contact_HouseNo_id").setValue("");
					t.byId("Contact_PostlCod1_id").setValue("");
					t.byId("Contact_EMail_id").setValue("");
				}
			});
		},
		onChange: function (e) {
			var t = e.getSource();
			var a = this.getView().getModel().oHeaders["x-csrf-token"];
			var i = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: a
			});
			t.addHeaderParameter(i);
		},
		onFilenameLengthExceed: function () {
			MessageBox.error(this.getResourceBundle().getText("UploadFileLengthError"));
		},
		onFileSizeExceed: function () {
			MessageBox.error(this.getResourceBundle().getText("UploadFileSizeError"));
		},
		onTypeMissmatch: function () {
			MessageBox.error(this.getResourceBundle().getText("UploadFileTypeError"));
		},
		onFileDeleted: function (e) {
			var t = this.getView().getBindingContext().getProperty("Guid");
			var a = e.getParameter("documentId");
			var i = "/AttachmentSet(Guid='" + t + "',Loio='" + encodeURIComponent(a) + "')/$value";
			var o = this.getView().getModel();
			o.remove(i, {
				success: function (e) {
					MessageToast.show("Die Datei wurde erfolgreich gelöscht");
				},
				error: function (e) {
					MessageBox.error("Fehler beim Löschen der Datei");
				}
			});
			this._refreshUploadCollection();
		},
		onUploadComplete: function (e) {
			this._oViewModel.setProperty("/enableCreate", true);
			this._setModelPropertyValue("/HasNewAttachments", true);
			this._refreshUploadCollection();
			MessageToast.show("Die Datei wurde erfolgreich hochgeladen");
		},
		onBeforeUploadStarts: function (e) {
			var t = this.getView().getBindingContext().getProperty("Guid");
			if (!t) {
				t = this.getView().getBindingContext().sPath.replace("/ApplicationSet('", "");
				t = t.replace("')", "");
				this._setModelPropertyValue("/PseudoGuidForCreate", t);
			}
			var a = t + ";" + e.getParameter("fileName");
			var i = new UploadCollectionParameter({
				name: "slug",
				value: encodeURIComponent(a)
			});
			e.getParameters().addHeaderParameter(i);
		},
		_refreshUploadCollection: function () {
			var e = this.getView().getBindingContext().getProperty("Guid");
			var t = this.byId("UploadCollection");
			var a;
			if (!e) {
				e = this.getView().getBindingContext().sPath.replace("/ApplicationSet('", "");
				e = e.replace("')", "");
				if (!this._collectionItemId) {
					a = this.byId("UploadCollectionItemId").clone();
				} else {
					a = this._collectionItemId.clone();
				}
				this._collectionItemId = a;
				t.bindAggregation("items", {
					path: "/AttachmentSet",
					template: a
				});
				var i = new sap.ui.model.Filter("Tempguid", sap.ui.model.FilterOperator.EQ, e);
				var o = t.getBinding("items");
				o.filter([i]);
			} else {
				t.getBinding("items").refresh();
			}
		},
		changeAntragstellerRb: function (e) {
			var t = e.getParameters("selected").id;
			if (t.includes("rbAntragstellerEinzelperson")) {
				this.byId("Form_Antragstellende_Organisation_id").setVisible(false);
				this.byId("Form_Anrede_id").setVisible(true);
				this.byId("Form_Titel_id").setVisible(true);
				this.byId("Form_Familienname_id").setVisible(true);
				this.byId("Form_Vorname_id").setVisible(true);
				if(this.byId("rbAntragstellerEinzelperson").getSelected()===false){
					this.byId("rbAntragstellerEinzelperson").setSelected(true);
				}
				this._setModelPropertyValue("/Organisation/BpCategory", "1");
				this._validateSaveEnablement();
			}
			else if (t.includes("rbAntragstellerEPVertretung")) {
				this.byId("Form_Antragstellende_Organisation_id").setVisible(false);
				this.byId("Form_Anrede_id").setVisible(true);
				this.byId("Form_Titel_id").setVisible(true);
				this.byId("Form_Familienname_id").setVisible(true);
				this.byId("Form_Vorname_id").setVisible(true);
				if(this.byId("rbAntragstellerEPVertretung").getSelected()===false){
					this.byId("rbAntragstellerEPVertretung").setSelected(true);
				}
				this._setModelPropertyValue("/Organisation/BpCategory", "9");
				this._validateSaveEnablement();

			}
			else if (t.includes("rbAntragstellerOrganisation")) {
				this.byId("Form_Antragstellende_Organisation_id").setVisible(true);
				this.byId("Form_Anrede_id").setVisible(false);
				this.byId("Form_Titel_id").setVisible(false);
				this.byId("Form_Familienname_id").setVisible(false);
				this.byId("Form_Vorname_id").setVisible(false);
				if(this.byId("rbAntragstellerOrganisation").getSelected()===false){
					this.byId("rbAntragstellerOrganisation").setSelected(true);
				}
				this._setModelPropertyValue("/Organisation/BpCategory", "2");
				this._validateSaveEnablement();

			}
			this.byId("Organisation_Name_id").setValue("");
			this.byId("Select_Anrede_id").clearSelection();
			this.byId("Select_Titel_id").clearSelection();
			this.byId("Familienname_id").setValue("");
			this.byId("Vorname_id").setValue("");
		},
		changeVeranstaltungRb: function (e) {
			var t = e.getParameter("selectedIndex");
			if (t === 0) {
				this.byId("Form_Oeffentlicher_Raum_id").setVisible(true);
				this.byId("Form_Oeffentlicher_Raum_Hinweis_id").setVisible(true);
				this._setModelPropertyValue("/Header/Event", true);
				this.byId("changeVeranstaltungsortRb").setVisible(true);
				this.byId("terminLabelId").setRequired(true);
			} else if (t === 1) {
				this.byId("Form_Oeffentlicher_Raum_id").setVisible(false);
				this.byId("Form_Oeffentlicher_Raum_Hinweis_id").setVisible(false);
				this._setModelPropertyValue("/Header/Event", false);
				this.byId("changeVeranstaltungsortRb").setVisible(false);
				this.byId("terminLabelId").setRequired(false);
				this._setModelPropertyValue("/Header/PublicEvent", false);
			}
			this.byId("rbVeranstaltungsortRB1").setSelected(false);
			this.byId("rbVeranstaltungsortRB2").setSelected(false);
		},
		changeVeranstaltungsortRb: function (e) {
			var t = e.getParameter("selectedIndex");
			if (t === 0) {
				this._setModelPropertyValue("/Header/PublicEvent", true);
			} else if (t === 1) {
				this._setModelPropertyValue("/Header/PublicEvent", false);
			}
		},
		changeVorsteuerRb: function (e) {
			var t = e.getParameter("selectedIndex");
			if (t === 0) {
				this._setModelPropertyValue("/Organisation/InputTaxFlag", true);
			} else if (t === 1) {
				this._setModelPropertyValue("/Organisation/InputTaxFlag", false);
			}
		},
		afterDataLoaded: function (e) {
			var t = this.byId("Select_Foerderprogramm_id").getItems()[0].getCustomData()[0].getValue();
			this._updateFoerderprogrammAttachments(t);
		},
		onAnredeSelect: function (e) {
			this._validateSaveEnablement();
		},
		onTitelSelect: function (e) {
			this._validateSaveEnablement();
		},
		onFoerderprogrammSelect: function (e) {
			var t = e.getParameter("selectedItem").getKey();
			this._setModelPropertyValue("/Header/ProgrammId", t);
			var a = e.getParameter("selectedItem").getCustomData()[0].getValue();
			this._updateFoerderprogrammAttachments(a);
			this._validateSaveEnablement();
		},
		_updateFoerderprogrammAttachments: function (e) {
			var t = this.byId("UploadCollectionProgramm");
			var a = this.byId("UploadCollectionItemProgramm").clone();
			var i = "/GrantorProgramSet('" + e + "')/ToAttachment";
			t.bindAggregation("items", {
				path: i,
				template: a
			});
		},
		_updateAttachments: function (e) {
			var t = this.byId("UploadCollection");
			var a;
			if (!this._collectionItemId) {
				a = this.byId("UploadCollectionItemId").clone();
			} else {
				a = this._collectionItemId.clone();
			}
			this._collectionItemId = a;
			var i = "/ApplicationSet('" + e + "')/ToAttachment";
			t.bindAggregation("items", {
				path: i,
				template: a
			});
		},
		onFoerderbereichSelect: function (e) {
			var t = e.getSource().getSelectedKey();
			var a = "selectFoerderbeichData>" + e.getSource().getSelectedItem().oBindingContexts.selectFoerderbeichData.sPath + "/items";
			var i = this.byId("projektartId");
			i.bindItems({
				path: a,
				template: new sap.ui.core.Item({
					key: "{selectFoerderbeichData>key}",
					text: "{selectFoerderbeichData>text}"
				})
			});
			this._setModelPropertyValue("/Header/Codegruppe", t);
			i.setValue("");
			i.clearSelection();
			this._validateSaveEnablement();
		},
		onProjektartSelect: function (e) {
			var t = e.getSource().getSelectedKey();
			this._setModelPropertyValue("/Header/Code", t);
			this._validateSaveEnablement();
		},
		onStartdateChange: function (e) {},
		countdown: 84e4,
		resetCountdown: 84e4,
		getInactivityTimeout: function () {
			return this.countdown;
		},
		setInactivityTimeout: function (e) {
			this.countdown = e;
			this.resetCountdown = this.countdown;
		},
		resetInactivityTimeout: function () {
			this.countdown = this.resetCountdown;
		},
		startInactivityTimer: function () {
			var e = this;
			this.intervalHandle = setInterval(function () {
				e._inactivityCountdown();
			}, 1e3);
		},
		stopInactivityTimer: function () {
			if (this.intervalHandle !== null) {
				clearInterval(this.intervalHandle);
				this.intervalHandle = null;
			}
		},
		_inactivityCountdown: function () {
			this.countdown -= 1e3;
			if (this.countdown <= 0) {
				this.stopInactivityTimer();
				this.resetInactivityTimeout();
			} else {
				var e = this.getInactivityTimeout();
				var t = "";
				if (this._oViewModel.getProperty("/mode") === "create") {
					t = this._oResourceBundle.getText("createViewTitle") + " (" + this._millisToMinutesAndSeconds(e) + ")";
				} else if (this._oViewModel.getProperty("/mode") === "edit") {
					t = this._oResourceBundle.getText("editViewTitle") + " (" + this._millisToMinutesAndSeconds(e) + ")";
				}
				this.byId("page").setTitle(t);
			}
		},
		_millisToMinutesAndSeconds: function (e) {
			var t = Math.floor(e / 6e4);
			var a = (e % 6e4 / 1e3).toFixed(0);
			return t + ":" + (a < 10 ? "0" : "") + a;
		}
	});
});