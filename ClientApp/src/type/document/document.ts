export type Document = {
  id: number,
  fileName: string,
  fileType: string,
  fileSize: string,
  blobPath: string,
  fileContents: Uint32Array
  modifiedDate: string,
  modifiedBy: string,
  companyId: string
}
