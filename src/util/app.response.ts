import { Prisma } from '@prisma/client';
/*
  ========== 1) 응답 관련 인터페이스들 ==========
*/

/* insert 응답 */
export interface InsertedResult {
  insertedId: number;
  groupId?: number;
}

/* bulk insert 응답 */
export interface BulkInsertedOrUpdatedResult {
  insertedOrUpdatedIds: Array<number>;
}

/* selectAll 응답 */
export type SelectedAllResult<T> = T[];

/* selectList 응답 */
export interface SelectedListResult<T> {
  count: number;
  rows: Array<T>;
}

/* selectInfo 응답 */
export interface SelectedInfoResult {
  id: number;

  [key: string]: unknown;
}

/* update 응답 */
export interface UpdatedResult {
  updatedCount: number;
}

/* delete 응답 */
export interface DeletedResult {
  deletedCount: number;
}

/* 로그인 응답 */
export interface LoggedInResult {
  accessToken?: string;
  login_result?: boolean;
  role?: string;
}

/* 파일 다운로드 */
export interface DownloadResult {
  downloadUrl: string;
}

/* 임의 자유형 응답 */
export interface FreeStyleResult {
  result: unknown;
}

/* multer 파일 응답 */
export interface MulterFile {
  path: string;
}

export interface UploadedMulterResult<MulterFile> {
  files: Array<MulterFile>;
}

/* 비밀번호 확인 */
export interface PWMatchResult {
  isPWMatched: boolean;
}

/* 신규 데이터 확인 */
export interface IsNewResult {
  isNew: boolean;
}

/* 체크 */
export interface IsCheckResult {
  isCheck: boolean;
}

/* 에러 응답 (시퀄라이즈/프리즈마 등) */
export interface SequelizeErrorResult {
  name: string;
  parent?: Error | null;
  original?: Error | null;
  sql?: string | null;
  fields?: { [key: string]: unknown } | null;
  parameters?: Array<any> | null;
  constranint?: string | null;
  table?: string | null;
  value?: unknown | null;
  index?: string | null;
}

/* 최종 응답 형태 */
export type ResponseJson<T> = {
  status: number;
  code: string;
  message: string | null;
  data:
    | InsertedResult
    | BulkInsertedOrUpdatedResult
    | SelectedInfoResult
    | SelectedAllResult<T>
    | SelectedListResult<T>
    | UpdatedResult
    | DeletedResult
    | LoggedInResult
    | DownloadResult
    | SequelizeErrorResult
    | FreeStyleResult
    | UploadedMulterResult<MulterFile>
    | PWMatchResult
    | IsNewResult
    | IsCheckResult
    | null;
  remark: unknown;
};

/*
  ========== 2) 상황별 응답 코드 ==========
*/
export const responseCode = {
  SUCCESS: {
    status: 200,
    code: 'SUCCESS',
    message: null,
    data: null,
    remark: null,
  } as ResponseJson<unknown>,
  ERROR: {
    status: 500,
    code: 'ERROR',
    message: null,
    data: null,
    remark: null,
  } as ResponseJson<unknown>,
  BAD_REQUEST_DUPLICATED: {
    status: 400,
    code: 'BAD_REQUEST_DUPLICATED',
    message: 'Duplicated value',
    data: null,
    remark: null,
  } as ResponseJson<unknown>,
  // 필요한 만큼 계속 추가...
};

/*
  ========== 3) 응답 타입에 따른 분기 열거형 ==========
*/
export enum ResponseType {
  REG,
  BULKREGUPDATE,
  LIST,
  LISTALL,
  INFO,
  EDIT,
  DELETE,
  LOGIN,
  FREESTYLE,
  DOWNLOAD,
  UPLOAD,
  PWCONFIRM,
  ISNEW,
  CHECK,
}

/*
  ========== 4) 성공 응답 생성 함수 ==========
*/
export function makeResponseSuccess(
  result: unknown,
  type: ResponseType,
): ResponseJson<unknown> {
  const resJson = { ...responseCode.SUCCESS };

  switch (type) {
    case ResponseType.REG:
      resJson.message = 'Inserted data successfully';
      resJson.data = result as InsertedResult;
      return resJson;

    case ResponseType.BULKREGUPDATE:
      resJson.message = 'Bulk insert or update successfully';
      resJson.data = result as BulkInsertedOrUpdatedResult;
      return resJson;

    case ResponseType.LIST:
      resJson.message = 'Searched list successfully';
      resJson.data = result as SelectedListResult<unknown>;
      return resJson;

    case ResponseType.LISTALL:
      resJson.message = 'Listed data successfully';
      resJson.data = result as SelectedAllResult<unknown>;
      return resJson;

    case ResponseType.INFO:
      resJson.message = 'Selected data successfully';
      resJson.data = result as SelectedInfoResult;
      return resJson;

    case ResponseType.EDIT:
      resJson.message = 'Updated data successfully';
      resJson.data = result as UpdatedResult;
      return resJson;

    case ResponseType.DELETE:
      resJson.message = 'Deleted data successfully';
      resJson.data = result as DeletedResult;
      return resJson;

    case ResponseType.LOGIN:
      resJson.message = 'Logged in successfully';
      resJson.data = result as LoggedInResult;
      return resJson;

    case ResponseType.DOWNLOAD:
      resJson.message = 'Download start';
      resJson.data = result as DownloadResult;
      return resJson;

    case ResponseType.UPLOAD:
      resJson.message = 'File uploaded successfully';
      resJson.data = result as UploadedMulterResult<MulterFile>;
      return resJson;

    case ResponseType.PWCONFIRM:
      resJson.message = 'Checked password successfully';
      resJson.data = result as PWMatchResult;
      return resJson;

    case ResponseType.ISNEW:
      resJson.message = 'Checked new data successfully';
      resJson.data = result as IsNewResult;
      return resJson;

    case ResponseType.CHECK:
      resJson.message = 'Checked data successfully';
      resJson.data = result as IsCheckResult;
      return resJson;

    default:
      // FREESTYLE 등 기타 케이스
      resJson.message = 'Request is successfully done';
      resJson.data = result as FreeStyleResult;
      return resJson;
  }
}

/*
  ========== 5) 커스텀 에러 클래스 ==========
*/
export class ErrorClass implements ResponseJson<unknown> {
  public status: number;
  public code: string;
  public message: string | null;
  public data: unknown;
  public remark: unknown;

  constructor(responseJson: ResponseJson<unknown>, customMessage?: string) {
    this.status = responseJson.status;
    this.code = responseJson.code;
    this.message = customMessage ? customMessage : responseJson.message;
    this.data = responseJson.data;
    this.remark = responseJson.remark;
  }
}

/*
  ========== 6) 에러 응답 생성 함수 ==========
*/
export function makeResponseError(err: unknown): ResponseJson<unknown> {
  // 기본값
  const resJson = { ...responseCode.ERROR };

  if (err instanceof ErrorClass) {
    // 커스텀 에러
    return err;
  }

  if (err instanceof Error) {
    resJson.message = err.message;
    resJson.remark = err.stack;
  }

  return resJson;
}
