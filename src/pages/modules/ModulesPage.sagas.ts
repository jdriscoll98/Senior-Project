import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  requestModules,
  requestModulesSuccess,
  requestModulesFailure,
  requestNewModule,
  requestNewModuleSuccess,
  requestNewModuleFailure,
  requestModifyModule,
  requestModifyModuleSuccess,
  requestModifyModuleFailure,
  requestDeleteModule,
  requestDeleteModuleSuccess,
  requestDeleteModuleFailure,
  closeDialog,
} from "./ModulesPage.slice";
import adminAPI from "../../app/common/apiClient";
import { IModuleBase, IRequestMessage } from "../../shared/types";
import { IAdminModule } from "./types";

function* handleGetModulesRequest(): any {
  // request

  let modulesRequest = () =>
    adminAPI.get<IAdminModule[]>("/v1/module/WithProblems");

  try {
    const response: AxiosResponse<IAdminModule[]> = yield call(modulesRequest);
    yield put(requestModulesSuccess(response.data));
  } catch (e) {
    yield put(requestModulesFailure(e as Error));
  }
}

function* handleAddModulesRequest(action: PayloadAction<IModuleBase>): any {
  // request & body
  let body = {
    name: action.payload.name,
    number: action.payload.number,
  };
  let moduleAddRequest = () => adminAPI.post<string>("/v1/module", body);

  try {
    // Add response content to sagas
    const response = yield call(moduleAddRequest);

    let new_module: IAdminModule = {
      name: action.payload.name,
      number: action.payload.number,
      problems: [],
      _id: response.data.id,
    };

    yield put(requestNewModuleSuccess(new_module));
    yield put(closeDialog());
  } catch (e) {
    yield put(requestNewModuleFailure(e as Error));
  }
}

function* handleModifyModulesRequest(action: PayloadAction<IModuleBase>): any {
  // request & body
  let body = {
    name: action.payload.name,
    number: action.payload.number,
  };
  let moduleModifyRequest = () =>
    adminAPI.put("/v1/module/" + action.payload._id, body);

  try {
    // Add response content to sagas
    const response: AxiosResponse<IAdminModule> = yield call(
      moduleModifyRequest
    );

    // reminder: doesnt have the IAdminModule.problems property
    let new_module: IAdminModule = response.data;
    yield put(requestModifyModuleSuccess(new_module));
    yield put(closeDialog());
  } catch (e) {
    yield put(requestModifyModuleFailure(e as Error));
  }
}

function* handleDeleteModulesRequest(action: PayloadAction<string>): any {
  // request
  let moduleID = action.payload;
  let moduleDeleteRequest = () => adminAPI.delete("/v1/module/" + moduleID);

  try {
    // Add response content to sagas
    const response: AxiosResponse<IRequestMessage> = yield call(
      moduleDeleteRequest
    );

    let payload = {
      response: response.data,
      id: moduleID,
    };

    yield put(requestDeleteModuleSuccess(payload));
  } catch (e) {
    yield put(requestDeleteModuleFailure(e as Error));
  }
}

function* modulesSaga() {
  yield takeEvery(requestModules.type, handleGetModulesRequest);
  yield takeEvery(requestNewModule.type, handleAddModulesRequest);
  yield takeEvery(requestModifyModule.type, handleModifyModulesRequest);
  yield takeEvery(requestDeleteModule.type, handleDeleteModulesRequest);
}

export default modulesSaga;
