export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]?: Maybe<T[SubKey]>}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]: Maybe<T[SubKey]>}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The name scalar represents a valid GraphQL name as specified in the spec and can be used to refer to fields or types. */
  Name: any
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: any
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: any
  /** The built-in `Decimal` scalar type. */
  Decimal: any
}

export type SearchQueryFilterInput = {
  searchTerm: Scalars['String']
  companyId?: InputMaybe<Scalars['String']>
  candidateId?: InputMaybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  companyById: Company
  companyActivities?: Maybe<ActivityCollectionSegment>
  companyContacts: Array<Contact>
  companyData?: Maybe<CompanyCollectionSegment>
  documentsById?: Maybe<DocumentCollectionSegment>
  notesById?: Maybe<NoteCollectionSegment>
  contacts?: Maybe<ContactCollectionSegment>
  contactById: Contact
  candidateById: Candidate
  candidates?: Maybe<CandidateCollectionSegment>
  contactInfoById: ContactInfo
}

export type _SchemaDefinition = {
  __typename?: '_SchemaDefinition'
  name: Scalars['String']
  document: Scalars['String']
  extensionDocuments: Array<Scalars['String']>
}

export type JobQuery = {
  __typename?: 'JobQuery'
  _schemaDefinition?: Maybe<_SchemaDefinition>
  hiringManagersByCompanyById: Array<HiringManager>
}

export type ActionQuery = {
  __typename?: 'ActionQuery'
  _schemaDefinition?: Maybe<_SchemaDefinition>
  notesByEntity?: Maybe<NoteCollectionSegment>
  noteByEntityIdAndId: Note
}

export type ActivityQuery = {
  __typename?: 'ActivityQuery'
  _schemaDefinition?: Maybe<_SchemaDefinition>
  activitiesByEntity?: Maybe<ActivityCollectionSegment>
  activityByEntityIdAndId: Activity
}

export type ActivityQuery_SchemaDefinitionArgs = {
  configuration: Scalars['String']
}

export type ActivityQueryActivitiesByEntityArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  entityId: Scalars['Int']
  entityName: Scalars['String']
}

export type ActivityQueryActivityByEntityIdAndIdArgs = {
  entityId: Scalars['Int']
  activityId: Scalars['Int']
}

export type ActionQuery_SchemaDefinitionArgs = {
  configuration: Scalars['String']
}

export type ActionQueryNotesByEntityArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  entityId: Scalars['Int']
  entityName: Scalars['String']
}

export type ActionQueryNoteByEntityIdAndIdArgs = {
  entityId: Scalars['Int']
  noteId: Scalars['Int']
}

export type QueryCompanyByIdArgs = {
  companyId: Scalars['Int']
}

export type QueryCompanyJobsArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  companyId: Scalars['Int']
  order?: InputMaybe<Array<RequisitionSortInput>>
}

export type QueryCompanyActivitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  companyId: Scalars['Int']
  order?: InputMaybe<Array<ActivitySortInput>>
}

export type QueryCompanyContactsArgs = {
  companyId: Scalars['Int']
}

export type QueryCompanyDataArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: CompanyFilterInput
  order?: InputMaybe<Array<CompanySortInput>>
}

export type QueryDocumentsByIdArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  companyId: Scalars['Int']
  order?: InputMaybe<Array<DocumentSortInput>>
}

export type QueryNotesByIdArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  companyId: Scalars['Int']
  entityName: Scalars['String']
}

export type QueryContactsArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  companyId: Scalars['Int']
  order?: InputMaybe<Array<ContactSortInput>>
}

export type QueryContactByIdArgs = {
  companyId: Scalars['Int']
  contactId: Scalars['Int']
}

export type QueryCandidateByIdArgs = {
  candidateId: Scalars['Int']
}

export type QueryCandidatesArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: CandidateFilterInput
  order?: InputMaybe<Array<CandidateSortInput>>
}

export type QueryContactInfoByIdArgs = {
  candidateId: Scalars['Int']
}

export type JobQuery_SchemaDefinitionArgs = {
  configuration: Scalars['String']
}

export type JobQueryHiringManagersByCompanyByIdArgs = {
  companyId: Scalars['Int']
}

export type JobQueryJobsArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: JobFilterInput
  order?: InputMaybe<Array<JobSortInput>>
}

export type JobCollectionSegment = {
  __typename?: 'JobCollectionSegment'
  items?: Maybe<Array<Job>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ActivityCollectionSegment = {
  __typename?: 'ActivityCollectionSegment'
  items?: Maybe<Array<Activity>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

/** Information about the offset pagination. */
export type CollectionSegmentInfo = {
  __typename?: 'CollectionSegmentInfo'
  /** Indicates whether more items exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']
  /** Indicates whether more items exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']
}

export type Company = {
  __typename?: 'Company'
  id: Scalars['Int']
  companyName?: Maybe<Scalars['String']>
  companyType?: Maybe<Scalars['String']>
  companyVertical?: Maybe<Scalars['String']>
  companyOwner?: Maybe<Scalars['String']>
  internalReference?: Maybe<Scalars['String']>
  parentCompany?: Maybe<Scalars['String']>
  companyRank?: Maybe<Scalars['String']>
  companySource?: Maybe<Scalars['String']>
  department?: Maybe<Scalars['String']>
  territory?: Maybe<Scalars['String']>
  backgroundInformation?: Maybe<Scalars['String']>
  contact?: Maybe<Scalars['String']>
  lastActivity?: Maybe<Scalars['String']>
  document?: Maybe<Scalars['Int']>
  createdBy?: Maybe<Scalars['String']>
  modifiedBy?: Maybe<Scalars['String']>
  createdDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  hiringManagers?: Array<Scalars['String']>
  contacts?: Array<Scalars['String']>
  userImageUrl?: Scalars['String']
  companyImageUrl?: Scalars['String']
  documentImage?: Maybe<Document>
  address?: Address
  primaryContactInfo?: Address
  percentageCompleted?: Scalars['Int']
  email?: Scalars['String']
  workingStageSummary?: Scalars['Int']
  resumenSentStageSummary?: Scalars['Int']
  offerStageSummary?: Scalars['Int']
  applicantStageSummary?: Scalars['Int']
}

export type CreateCompanyAccount = {
  __typename?: 'CreateCompanyAccount'
  companyName?: Maybe<Scalars['String']>
  addressLine?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  webSite?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type CompanyCollectionSegment = {
  __typename?: 'CompanyCollectionSegment'
  items?: Maybe<Array<Company>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type Contact = {
  __typename?: 'Contact'
  id?: Scalars['Int']
  /** Gets or sets the contact name */
  contactName?: Scalars['String']
  /** Gets or sets the email name */
  email?: Scalars['String']
  /** Gets or sets the contact name */
  phone?: Maybe<Scalars['String']>
  /** Gets or sets the is primary conctact */
  addressLine1?: Maybe<Scalars['String']>
  addressLine2?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['String']>
  isPrimaryContact?: Scalars['Boolean']
  isPrimaryTelephone?: Scalars['Boolean']
  createdBy?: Maybe<Scalars['String']>
  modifiedBy?: Maybe<Scalars['String']>
  createdDate?: Scalars['DateTime']
  modifiedDate?: Scalars['DateTime']
  /** Gets or sets the Company entity object */
  companyId?: Scalars['Int']
}

export type Document = {
  __typename?: 'Document'
  id?: Scalars['Int']
  fileName?: Scalars['String']
  blobPath?: Scalars['String']
  blobName?: Scalars['String']
  fileType?: Scalars['String']
  fileSize?: Scalars['String']
  modifiedDate?: Scalars['String']
  modifiedBy?: Scalars['String']
  fileContents?: Array<Scalars['Byte']>
  userId?: Scalars['Int']
  companyId?: Scalars['Int']
  entityName?: Scalars['String']
}

export type userImageProfile = {
  __typename?: 'Document'
  id?: Scalars['Int']
  fileName?: Scalars['String']
  blobPath?: Scalars['String']
  blobName?: Scalars['String']
  fileType?: Scalars['String']
  fileSize?: Scalars['String']
  modifiedDate?: Scalars['String']
  modifiedBy?: Scalars['String']
  fileContents?: Array<Scalars['Byte']>
  userId?: Scalars['Int']
  companyId?: Scalars['Int']
  entityName?: Scalars['String']
}

export type DocumentCollectionSegment = {
  __typename?: 'DocumentCollectionSegment'
  items?: Maybe<Array<Document>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type Note = {
  __typename?: 'Note'
  id?: Maybe<Scalars['Int']>
  entityId?: Maybe<Scalars['Int']>
  text?: Maybe<Scalars['String']>
  createdBy?: Maybe<Scalars['String']>
  modifiedBy?: Maybe<Scalars['String']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  createdDate?: Maybe<Scalars['DateTime']>
}

export type NoteCollectionSegment = {
  __typename?: 'NoteCollectionSegment'
  items?: Maybe<Array<Note>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type HistoryCollectionSegment = {
  __typename?: 'HistoryCollectionSegment'
  items?: Maybe<Array<History>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ActivitySortInput = {
  id?: InputMaybe<SortEnumType>
  action?: InputMaybe<SortEnumType>
  createdBy?: InputMaybe<SortEnumType>
  modifiedBy?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  entityId?: InputMaybe<SortEnumType>
  entityName?: InputMaybe<SortEnumType>
}

export type AddressInput = {
  id: Scalars['Int']
  street: Scalars['String']
  city: Scalars['String']
  state: Scalars['String']
  country: Scalars['String']
  zipCode: Scalars['String']
  candidateId: Scalars['Int']
}

export type CompanyFilterInput = {
  /** Gets or sets FromDate. */
  fromDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets ToDate. */
  toDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets Company name. */
  companyName?: InputMaybe<Scalars['String']>
  /** Gets or sets Status. */
  companyType?: InputMaybe<Scalars['String']>
  /** Gets or sets Email. */
  email?: InputMaybe<Scalars['String']>
  /** Gets or sets Phone. */
  phone?: InputMaybe<Scalars['String']>
  /** Gets or sets Contact. */
  contact?: InputMaybe<Scalars['String']>
  /** Gets or sets Contact. */
  hiringManager?: InputMaybe<Scalars['String']>
  /** Gets or sets Address. */
  address?: InputMaybe<AddressInput>
  /** Gets or sets Internal Reference. */
  internalReference?: InputMaybe<Scalars['String']>
}

export type CompanySortInput = {
  id?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  companyType?: InputMaybe<SortEnumType>
  companyVertical?: InputMaybe<SortEnumType>
  companyOwner?: InputMaybe<SortEnumType>
  internalReference?: InputMaybe<SortEnumType>
  parentCompany?: InputMaybe<SortEnumType>
  companyRank?: InputMaybe<SortEnumType>
  companySource?: InputMaybe<SortEnumType>
  department?: InputMaybe<SortEnumType>
  territory?: InputMaybe<SortEnumType>
  backgroundInformation?: InputMaybe<SortEnumType>
  contact?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
  document?: InputMaybe<SortEnumType>
  createdBy?: InputMaybe<SortEnumType>
  modifiedBy?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  isActived?: InputMaybe<SortEnumType>
}

export type HistorySortInput = {
  id?: InputMaybe<SortEnumType>
  jobName?: InputMaybe<SortEnumType>
  workType?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  statusAchieved?: InputMaybe<SortEnumType>
  status?: InputMaybe<SortEnumType>
  owner?: InputMaybe<SortEnumType>
  startDate?: InputMaybe<SortEnumType>
  endDate?: InputMaybe<SortEnumType>
}

export type DocumentSortInput = {
  id?: InputMaybe<SortEnumType>
  fileName?: InputMaybe<SortEnumType>
  blobPath?: InputMaybe<SortEnumType>
  blobName?: InputMaybe<SortEnumType>
  fileType?: InputMaybe<SortEnumType>
  fileSize?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  modifiedBy?: InputMaybe<SortEnumType>
  userId?: InputMaybe<SortEnumType>
  companyId?: InputMaybe<SortEnumType>
  entityName?: InputMaybe<SortEnumType>
}

export type RequisitionSortInput = {
  id?: InputMaybe<SortEnumType>
  companyId?: InputMaybe<SortEnumType>
  hiringMananger?: InputMaybe<SortEnumType>
  recruiterAssigned?: InputMaybe<SortEnumType>
  clientJobCode?: InputMaybe<SortEnumType>
  jobDescription?: InputMaybe<SortEnumType>
  openings?: InputMaybe<SortEnumType>
  relocation?: InputMaybe<SortEnumType>
  positionsRemaning?: InputMaybe<SortEnumType>
  shiftSchedule?: InputMaybe<SortEnumType>
  shiftType?: InputMaybe<SortEnumType>
  education?: InputMaybe<SortEnumType>
  positionType?: InputMaybe<SortEnumType>
  department?: InputMaybe<SortEnumType>
  remote?: InputMaybe<SortEnumType>
  additionalJobUsers?: InputMaybe<SortEnumType>
  travelPercentage?: InputMaybe<SortEnumType>
  city?: InputMaybe<SortEnumType>
  state?: InputMaybe<SortEnumType>
  zipCode?: InputMaybe<SortEnumType>
  country?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  statusId?: InputMaybe<SortEnumType>
}

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER'
}

export enum Remote {
  /** Yes */
  Yes = 'YES',
  /** No */
  No = 'NO'
}

export enum ShiftType {
  /** Contract */
  Contract = 'CONTRACT',
  /** Permanent */
  Permanent = 'PERMANENT',
  /** Temporary */
  Temporary = 'TEMPORARY'
}

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ContactCollectionSegment = {
  __typename?: 'ContactCollectionSegment'
  items?: Maybe<Array<Contact>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ContactFilterInput = {
  /** Gets or sets CompanyName. */
  companyName?: InputMaybe<Scalars['String']>
  /** Gets or sets State. */
  state?: InputMaybe<Scalars['String']>
}

export type ContactSortInput = {
  id?: InputMaybe<SortEnumType>
  contactName?: InputMaybe<SortEnumType>
  email?: InputMaybe<SortEnumType>
  phone?: InputMaybe<SortEnumType>
  isPrimaryConctact?: InputMaybe<SortEnumType>
  department?: InputMaybe<SortEnumType>
  addressLine1?: InputMaybe<SortEnumType>
  addressLine2?: InputMaybe<SortEnumType>
  city?: InputMaybe<SortEnumType>
  country?: InputMaybe<SortEnumType>
  state?: InputMaybe<SortEnumType>
  zipCode?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
  createdBy?: InputMaybe<SortEnumType>
  modifiedBy?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  companyId?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
}

export type Address = {
  __typename?: 'Address'
  id?: Scalars['Int']
  addressLine1?: Scalars['String']
  city?: Scalars['String']
  state?: Scalars['String']
  zipCode?: Scalars['String']
  country?: Scalars['String']
  addressLine2?: Scalars['String']
  email?: Scalars['String']
  website?: Scalars['String']
  primaryContact?: Scalars['String']
  primaryPhone?: Scalars['String']
  phone?: Scalars['String']
  candidateId?: Scalars['Int']
  contactName?: Scalars['String']
}
export type Rate = {
  __typename?: 'Rate'
  hourly?: Scalars['Int']
  salary?: Scalars['Int']
}
export type Skill = {
  __typename?: 'Skill'
  skillSet?: Maybe<Scalars['String']>
  candidateId?: Maybe<Scalars['Int']>
}

export type Education = {
  __typename?: 'Education'
  school?: Maybe<Scalars['String']>
  degree?: Maybe<Scalars['String']>
  major?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  currentlyPursuing?: Scalars['Boolean']
  candidateId?: Maybe<Scalars['Int']>
}

export type Experience = {
  __typename?: 'Experience'
  ocuppation?: Maybe<Scalars['String']>
  company?: Maybe<Scalars['String']>
  summary?: Maybe<Scalars['String']>
  currentlyWorkHere?: Scalars['Boolean']
  fromDate?: Maybe<Scalars['DateTime']>
  toDate?: Maybe<Scalars['DateTime']>
}

export type Candidate = {
  __typename?: 'Candidate'
  id?: Scalars['Int']
  userId?: Scalars['Int']
  code?: Scalars['Int']
  firstName?: Scalars['String']
  prefferedName?: Scalars['String']
  lastName?: Scalars['String']
  displayAs?: Scalars['String']
  department?: Scalars['String']
  owner?: Scalars['String']
  jobTitle?: Scalars['String']
  jobName?: Scalars['String']
  currentEmployer?: Scalars['String']
  source?: Scalars['String']
  status?: Scalars['String']
  email?: Scalars['String']
  otherEmail?: Scalars['String']
  homePhone?: Scalars['String']
  cellPhone?: Scalars['String']
  workPhone?: Scalars['String']
  linkedIn?: Scalars['String']
  facebook?: Scalars['String']
  twitter?: Scalars['String']
  indeed?: Scalars['String']
  noticePeriod?: Scalars['String']
  summary?: Scalars['String']
  workType?: Scalars['String']
  timeZone?: Scalars['String']
  marketing?: Scalars['String']
  dateLastContacted?: Scalars['DateTime']
  dateResumeSent?: Scalars['DateTime']
  territory?: Scalars['String']
  createdDate?: Scalars['DateTime']
  modifiedDate?: Scalars['DateTime']
  isDeleted?: Scalars['Boolean']
  byEmail?: Scalars['Boolean']
  byPhone?: Scalars['Boolean']
  byText?: Scalars['Boolean']
  rigthToRepresent?: Scalars['Boolean']
  privateRecord?: Scalars['Boolean']
  jobId?: Maybe<Scalars['Int']>
  stageId?: Maybe<Scalars['Int']>
  address?: Address
  skills?: Maybe<Array<Skill>>
  educations?: Maybe<Array<Education>>
  experiences?: Maybe<Array<Experience>>
  document?: Maybe<Document>
  percentageCompleted?: Scalars['Int']
  userImageUrl?: Scalars['String']
  lookingJob?: Scalars['Int']
  rate?: Scalars['Int']
  rateMount?: Scalars['String']
}

export type JobQueryApplicantsByJobIdArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  jobId: Scalars['Int']
  order?: InputMaybe<Array<ApplicantSortInput>>
}

export type CandidateCollectionSegment = {
  __typename?: 'CandidateCollectionSegment'
  items?: Maybe<Array<Candidate>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ApplicantCollectionSegment = {
  __typename?: 'ApplicantCollectionSegment'
  items?: Maybe<Array<Applicant>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ApplicantSortInput = {
  jobId?: InputMaybe<SortEnumType>
  candidateId?: InputMaybe<SortEnumType>
  applicantName?: InputMaybe<SortEnumType>
  source?: InputMaybe<SortEnumType>
  startDate?: InputMaybe<SortEnumType>
  endDate?: InputMaybe<SortEnumType>
  applicationDate?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
}

export type ResumeHistorySortInput = {
  jobId?: InputMaybe<SortEnumType>
  jobTittle?: InputMaybe<SortEnumType>
  jobDescription?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  startDate?: InputMaybe<SortEnumType>
  endDate?: InputMaybe<SortEnumType>
  salaryRate?: InputMaybe<SortEnumType>
}

export type ResumeHistoryCollectionSegment = {
  __typename?: 'ResumeHistoryCollectionSegment'
  items?: Maybe<Array<ResumeHistory>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type SearchQuery_SchemaDefinitionArgs = {
  configuration: Scalars['String']
}

export type SearchQuerySearchTermsArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  searchTerm: Scalars['String']
  order?: InputMaybe<Array<SearchResultSortInput>>
}

export type SearchResultSortInput = {
  id?: InputMaybe<SortEnumType>
  name?: InputMaybe<SortEnumType>
  entityType?: InputMaybe<SortEnumType>
}

export type SearchResultCollectionSegment = {
  __typename?: 'SearchResultCollectionSegment'
  items?: Maybe<Array<SearchResult>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type CandidateFilterInput = {
  /** Gets or sets FromDate. */
  fromDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets ToDate. */
  toDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets Job Title. */
  jobTitle?: InputMaybe<Scalars['String']>
  /** Gets or sets Name. */
  name?: InputMaybe<Scalars['String']>
  /** Gets or sets Status. */
  status?: InputMaybe<Scalars['String']>
  /** Gets or sets Source. */
  source?: InputMaybe<Scalars['String']>
  /** Gets or sets Owner. */
  owner?: InputMaybe<Scalars['String']>
  /** Gets or sets Department. */
  department?: InputMaybe<Scalars['String']>
  /** Gets or sets Territory. */
  territory?: InputMaybe<Scalars['String']>
  /** Gets or sets Notice Period. */
  country?: InputMaybe<Scalars['String']>
  /** Gets or sets Notice Period. */
  userId?: Maybe<Scalars['String']>
}

export type CandidateSortInput = {
  id?: InputMaybe<SortEnumType>
  code?: InputMaybe<SortEnumType>
  firstName?: InputMaybe<SortEnumType>
  prefferedName?: InputMaybe<SortEnumType>
  lastName?: InputMaybe<SortEnumType>
  displayAs?: InputMaybe<SortEnumType>
  department?: InputMaybe<SortEnumType>
  owner?: InputMaybe<SortEnumType>
  jobTitle?: InputMaybe<SortEnumType>
  jobName?: InputMaybe<SortEnumType>
  currentEmployer?: InputMaybe<SortEnumType>
  source?: InputMaybe<SortEnumType>
  status?: InputMaybe<SortEnumType>
  email?: InputMaybe<SortEnumType>
  otherEmail?: InputMaybe<SortEnumType>
  homePhone?: InputMaybe<SortEnumType>
  cellPhone?: InputMaybe<SortEnumType>
  workPhone?: InputMaybe<SortEnumType>
  linkedIn?: InputMaybe<SortEnumType>
  indeed?: InputMaybe<SortEnumType>
  facebook?: InputMaybe<SortEnumType>
  twitter?: InputMaybe<SortEnumType>
  noticePeriod?: InputMaybe<SortEnumType>
  summary?: InputMaybe<SortEnumType>
  workType?: InputMaybe<SortEnumType>
  timeZone?: InputMaybe<SortEnumType>
  marketing?: InputMaybe<SortEnumType>
  dateLastContacted?: InputMaybe<SortEnumType>
  dateResumeSent?: InputMaybe<SortEnumType>
  territory?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  isDeleted?: InputMaybe<SortEnumType>
  byEmail?: InputMaybe<SortEnumType>
  byPhone?: InputMaybe<SortEnumType>
  byText?: InputMaybe<SortEnumType>
  rigthToRepresent?: InputMaybe<SortEnumType>
  privateRecord?: InputMaybe<SortEnumType>
  requisitionId?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
}

export type ContactInfo = {
  __typename?: 'ContactInfo'
  candidateId: Scalars['Int']
  addressLine1?: Maybe<Scalars['String']>
  addressLine2?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  homePhone?: Maybe<Scalars['String']>
  cellPhone?: Maybe<Scalars['String']>
  workPhone?: Maybe<Scalars['String']>
  linkedIn?: Maybe<Scalars['String']>
  indeed?: Maybe<Scalars['String']>
  facebook?: Maybe<Scalars['String']>
  twitter?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  otherEmail?: Maybe<Scalars['String']>
}

export type Activity = {
  __typename?: 'Activity'
  id: Scalars['Int']
  action?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  company?: Maybe<Scalars['String']>
  contact?: Maybe<Scalars['String']>
  createdBy?: Maybe<Scalars['String']>
  modifiedBy?: Maybe<Scalars['String']>
  createdDate: Scalars['DateTime']
  modifiedDate: Scalars['DateTime']
  entityId: Scalars['Int']
  entityName?: Maybe<Scalars['String']>
}

export type History = {
  __typename?: 'History'
  id: Scalars['Int']
  jobName: Scalars['String']
  workType: Scalars['String']
  companyName: Scalars['String']
  statusAchieved: Scalars['String']
  status: Scalars['String']
  owner: Scalars['String']
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
}

export type HiringManager = {
  __typename?: 'HiringManager'
  id: Scalars['Int']
  hiringManagerName?: Scalars['String']
}

export type JobSortInput = {
  id?: InputMaybe<SortEnumType>
  companyId?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  statusId?: InputMaybe<SortEnumType>
  status?: InputMaybe<SortEnumType>
  jobName?: InputMaybe<SortEnumType>
  jobType?: InputMaybe<SortEnumType>
  jobSource?: InputMaybe<SortEnumType>
  jobDescription?: InputMaybe<SortEnumType>
  jobOwnerShip?: InputMaybe<SortEnumType>
  city?: InputMaybe<SortEnumType>
  state?: InputMaybe<SortEnumType>
  zipCode?: InputMaybe<SortEnumType>
  territory?: InputMaybe<SortEnumType>
  isDeleted?: InputMaybe<SortEnumType>
  numOfPositions?: InputMaybe<SortEnumType>
  contactName?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  totalDocuments?: InputMaybe<SortEnumType>
  candidates?: InputMaybe<SortEnumType>
  internalReference?: InputMaybe<SortEnumType>
  stage?: InputMaybe<SortEnumType>
}

export type JobFilterInput = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
  status?: InputMaybe<Scalars['String']>
  companyName?: InputMaybe<Scalars['String']>
  jobName?: InputMaybe<Scalars['String']>
  jobType?: InputMaybe<Scalars['String']>
  jobSource?: InputMaybe<Scalars['String']>
  jobOwnerShip?: InputMaybe<Scalars['String']>
  city?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  candidateId?: InputMaybe<Scalars['String']>
  isDeleted?: InputMaybe<Scalars['String']>
  companyId?: InputMaybe<Scalars['String']>
  internalReference?: InputMaybe<Scalars['String']>
}

export type Job = {
  __typename?: 'Job'
  id?: Scalars['Int']
  companyId: Scalars['Int']
  companyName?: Scalars['String']
  companyVertical?: Scalars['String']
  statusId?: Scalars['Int']
  status?: Scalars['Int']
  jobName: Scalars['String']
  jobType: Scalars['String']
  jobExternalType: Scalars['String']
  jobSource?: Scalars['String']
  jobDescription?: Scalars['String']
  jobOwnerShip: Scalars['String']
  city: Scalars['String']
  state: Scalars['String']
  zipCode: Scalars['String']
  territory?: Scalars['String']
  isDeleted?: Scalars['Boolean']
  numOfPositions?: Scalars['Int']
  contactName?: Scalars['String']
  contactId: Scalars['Int']
  createdDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  totalDocuments?: Scalars['Int']
  candidates?: Scalars['Int']
  timeOffer?: Maybe<Scalars['DateTime']>
  timeFill?: Maybe<Scalars['DateTime']>
  career?: Scalars['String']
  payRange?: Scalars['String']
  jobVertical?: Scalars['String']
  internalReference?: Scalars['String']
}

export type Applicant = {
  __typename?: 'Applicant'
  jobId?: Scalars['Int']
  candidateId?: Scalars['Int']
  applicantName?: Scalars['String']
  source?: Scalars['String']
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  applicationDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  stageId?: Maybe<Scalars['Int']>
  stageDate?: Maybe<Scalars['DateTime']>
  offerStatus?: Maybe<Scalars['String']>
  note?: Maybe<Scalars['String']>
  nonSelecctionReason?: Maybe<Scalars['String']>
  lastActivity?: Maybe<Scalars['String']>
  timeStart?: Maybe<Scalars['DateTime']>
  amount?: Scalars['Decimal']
  frequency?: Scalars['String']
  jobType?: Maybe<Scalars['String']>
  resumeFileName?: Maybe<Scalars['String']>
  resumePath?: Maybe<Scalars['String']>
}

export type ResumeHistory = {
  __typename?: 'ResumeHistory'
  jobId: Scalars['Int']
  jobTittle: Scalars['String']
  jobDescription: Scalars['String']
  companyName: Scalars['String']
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  salaryRate: Scalars['String']
}

export type SearchResult = {
  __typename?: 'SearchResult'
  id?: Maybe<Scalars['Int']>
  name?: Maybe<Scalars['String']>
  entityType?: Maybe<Scalars['String']>
  jobType?: Maybe<Scalars['String']>
  jobOwnerShip?: Maybe<Scalars['String']>
}

export type ReportQuery = {
  __typename?: 'ReportQuery'
  _schemaDefinition?: Maybe<_SchemaDefinition>
  jobsReport?: Maybe<JobReportCollectionSegment>
  companiesReport?: Maybe<CompanyReportCollectionSegment>
  applicantsReport?: Maybe<ApplicantReportCollectionSegment>
}

export type ReportQuery_SchemaDefinitionArgs = {
  configuration: Scalars['String']
}

export type ReportQueryJobsReportArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: JobFilterInput
  order?: InputMaybe<Array<JobReportSortInput>>
}

export type ReportQueryCompaniesReportArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: CompanyFilterInput
  order?: InputMaybe<Array<CompanyReportSortInput>>
}

export type ReportQueryApplicantsReportArgs = {
  skip?: InputMaybe<Scalars['Int']>
  take?: InputMaybe<Scalars['Int']>
  filter: CandidateFilterInput
  order?: InputMaybe<Array<ApplicantReportSortInput>>
}

export type JobReportSortInput = {
  companyName?: InputMaybe<SortEnumType>
  jobName?: InputMaybe<SortEnumType>
  jobId?: InputMaybe<SortEnumType>
  contactName?: InputMaybe<SortEnumType>
  fullName?: InputMaybe<SortEnumType>
  candidateId?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
}

export type CompanyReportSortInput = {
  companyName?: InputMaybe<SortEnumType>
  owner?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  contactEmail?: InputMaybe<SortEnumType>
  contactPhone?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
  location?: InputMaybe<SortEnumType>
  taskStatus?: InputMaybe<SortEnumType>
}

export type ApplicantReportSortInput = {
  jobName?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  state?: InputMaybe<SortEnumType>
  startDate?: InputMaybe<SortEnumType>
  endDate?: InputMaybe<SortEnumType>
  fullName?: InputMaybe<SortEnumType>
  contactEmail?: InputMaybe<SortEnumType>
  contactName?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
}

export type JobReportCollectionSegment = {
  __typename?: 'JobReportCollectionSegment'
  items?: Maybe<Array<JobReport>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type CompanyReportCollectionSegment = {
  __typename?: 'CompanyReportCollectionSegment'
  items?: Maybe<Array<CompanyReport>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type ApplicantReportCollectionSegment = {
  __typename?: 'ApplicantReportCollectionSegment'
  items?: Maybe<Array<ApplicantReport>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type JobReport = {
  __typename?: 'JobReport'
  companyName?: Maybe<Scalars['String']>
  jobName?: Maybe<Scalars['String']>
  jobId?: Maybe<Scalars['Int']>
  contactName?: Maybe<Scalars['String']>
  fullName?: Maybe<Scalars['String']>
  candidateId?: Maybe<Scalars['Int']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  lastActivity?: Maybe<Scalars['String']>
}

export type CompanyReport = {
  __typename?: 'CompanyReport'
  companyName?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  createdDate?: Maybe<Scalars['DateTime']>
  contactEmail?: Maybe<Scalars['String']>
  contactPhone?: Maybe<Scalars['String']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  lastActivity?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  taskStatus?: Maybe<Scalars['String']>
}

export type ApplicantReport = {
  __typename?: 'ApplicantReport'
  jobName?: Maybe<Scalars['String']>
  companyName?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  fullName?: Maybe<Scalars['String']>
  contactEmail?: Maybe<Scalars['String']>
  contactName?: Maybe<Scalars['String']>
  lastActivity?: Maybe<Scalars['DateTime']>
}

export type MetricsFilterInput = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
  jobName?: InputMaybe<Scalars['String']>
  companyName?: InputMaybe<Scalars['String']>
}

export type MetricsReport = {
  __typename?: 'MetricsReport'
  candidateName?: Maybe<Scalars['String']>
  candidateSource?: Maybe<Scalars['String']>
  stage?: Maybe<Scalars['String']>
  applicationDate?: Maybe<Scalars['DateTime']>
  preScreenDate?: Maybe<Scalars['DateTime']>
  gapPreScreenDays?: Maybe<Scalars['Int']>
  managerRepliesDate?: Maybe<Scalars['DateTime']>
  gapManagerRepliesDays?: Maybe<Scalars['Int']>
  hirevueInterviewDate?: Maybe<Scalars['DateTime']>
  gapHirevueInterviewDays?: Maybe<Scalars['Int']>
  offerDate?: Maybe<Scalars['DateTime']>
  offerStatus?: Maybe<Scalars['String']>
  gapOfferDays?: Maybe<Scalars['Int']>
  hireDate?: Maybe<Scalars['DateTime']>
  gapHireDays?: Maybe<Scalars['Int']>
  timeFill?: Maybe<Scalars['Int']>
  timeStart?: Maybe<Scalars['Int']>
  nonSelectionReason?: Maybe<Scalars['String']>
  notes?: Maybe<Scalars['String']>
}

export type MetricsReportCollectionSegment = {
  __typename?: 'MetricsReportCollectionSegment'
  items?: Maybe<Array<MetricsReport>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type UserFilterInput = {
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
  email?: InputMaybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  id?: Maybe<Scalars['Int']>
  userName?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  roles?: Maybe<Array<Scalars['String']>>
  createdDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
  passwordReset?: Scalars['Boolean']
  isAccountClosed?: Scalars['Boolean']
}

export type UserCollectionSegment = {
  __typename?: 'UserCollectionSegment'
  items?: Maybe<Array<User>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type UserSortInput = {
  id?: InputMaybe<SortEnumType>
  userName?: InputMaybe<SortEnumType>
  email?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
}

export type BillingFilterInput = {
  companyName?: InputMaybe<Scalars['String']>
  companyId?: Maybe<Scalars['String']>
  invoiceNumber?: InputMaybe<Scalars['String']>
  jobName?: InputMaybe<Scalars['String']>
  jobType?: InputMaybe<Scalars['String']>
  jobVertical?: InputMaybe<Scalars['String']>
  companyContact?: InputMaybe<Scalars['String']>
  invoiced?: Scalars['Boolean']
  paid?: Scalars['Boolean']
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
  invoiceFromDate?: InputMaybe<Scalars['DateTime']>
  invoiceToDate?: InputMaybe<Scalars['DateTime']>
  paymentFromDate?: InputMaybe<Scalars['DateTime']>
  paymentToDate?: InputMaybe<Scalars['DateTime']>
  notificationFromDate?: InputMaybe<Scalars['DateTime']>
  notificationToDate?: InputMaybe<Scalars['DateTime']>
  billingNumber?: Maybe<Scalars['String']>
}

export type BillingSettings = {
  __typename?: 'BillingSettings'
  id?: Maybe<Scalars['Int']>
  companyId?: Maybe<Scalars['Int']>
  jobId?: Maybe<Scalars['Int']>
  executiveFeeSalary?: Scalars['Decimal']
  executiveFeePercentage?: Scalars['Decimal']
  executiveFeeOwed?: Scalars['Decimal']
  directHireSalary?: Scalars['Decimal']
  directHirePercentage?: Scalars['Decimal']
  directFeeOwed?: Scalars['Decimal']
  sharedRiskMonthlyFee?: Scalars['Decimal']
  sharedRiskMonthlyRenewalDate?: Scalars['DateTime']
  contractValidalityDate?: Scalars['DateTime']
  sharedRiskPerHireFee?: Scalars['Decimal']
  contractorHourlyRate?: Scalars['Decimal']
  contractorOverridePercentage?: Scalars['Decimal']
  contractorOverridePerHour?: Scalars['Decimal']
  contractorClientInvoiceAmount?: Scalars['Decimal']
  terms?: Scalars['String']
  createdDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
}

export type CompanyVertical = {
  __typename?: 'CompanyVertical'
  id?: Maybe<Scalars['Int']>
  vertical?: Maybe<Scalars['String']>
}

export type BillingItem = {
  __typename?: 'BillingItem'
  id?: Maybe<Scalars['Int']>
  invoiceNumber?: Maybe<Scalars['String']>
  billingNumber?: Maybe<Scalars['String']>
  companyId?: Scalars['Int']
  jobId?: Scalars['Int']
  units?: Scalars['Decimal']
  hoursWorked?: Scalars['Decimal']
  adExp?: Scalars['Decimal']
  reqNumber?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  supervisor?: Maybe<Scalars['String']>
  costCenter?: Maybe<Scalars['String']>
  sharedRiskMonthly?: Scalars['Decimal']
  perPerson?: Scalars['Decimal']
  directHire?: Scalars['Decimal']
  hourly?: Scalars['Decimal']
  lineTotal?: Maybe<Scalars['Decimal']>
  isDeleted?: Scalars['Boolean']
  createdDate?: Maybe<Scalars['DateTime']>
  modifiedDate?: Maybe<Scalars['DateTime']>
}

export type BillingItemFilterInput = {
  /** Gets or sets CompanyId. */
  companyId?: Scalars['Int']
  /** Gets or sets JobId. */
  jobId?: Scalars['Int']
  /** Gets or sets FromDate. */
  fromDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets ToDate. */
  toDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets Billing Number. */
  billingNumber?: InputMaybe<Scalars['String']>
}

export type InvoiceFilterInput = {
  /** Gets or sets CompanyId. */
  companyId: Scalars['Int']
  /** Gets or sets FromDate. */
  fromDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets ToDate. */
  toDate?: InputMaybe<Scalars['DateTime']>
  /** Gets or sets Invoice Number. */
  invoiceNumber?: InputMaybe<Scalars['String']>
}

export type InvoiceSortInput = {
  id?: InputMaybe<SortEnumType>
  companyId?: InputMaybe<SortEnumType>
  accountManager?: InputMaybe<SortEnumType>
  invoiceNumber?: InputMaybe<SortEnumType>
  invoiceStatus?: InputMaybe<SortEnumType>
  terms?: InputMaybe<SortEnumType>
  startDate?: InputMaybe<SortEnumType>
  paymentTerms?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  modifiedDate?: InputMaybe<SortEnumType>
  subTotal?: InputMaybe<SortEnumType>
  salesTax?: InputMaybe<SortEnumType>
  total?: InputMaybe<SortEnumType>
  isPaid?: InputMaybe<SortEnumType>
  invoiced?: InputMaybe<SortEnumType>
  isDeleted?: InputMaybe<SortEnumType>
  paymentdDate?: InputMaybe<SortEnumType>
  discount?: InputMaybe<SortEnumType>
}

export type Invoice = {
  __typename?: 'Invoice'
  id?: Maybe<Scalars['Int']>
  companyId?: Scalars['Int']
  accountManager?: Maybe<Scalars['String']>
  invoiceNumber?: Maybe<Scalars['String']>
  invoiceStatus?: Maybe<Scalars['String']>
  terms?: Maybe<Scalars['String']>
  startDate?: Scalars['DateTime']
  paymentTerms?: Maybe<Scalars['String']>
  createdDate?: Scalars['DateTime']
  modifiedDate?: Scalars['DateTime']
  subTotal?: Maybe<Scalars['Decimal']>
  salesTax?: Maybe<Scalars['Decimal']>
  total?: Maybe<Scalars['Decimal']>
  isPaid?: Scalars['Boolean']
  invoiced?: Scalars['Boolean']
  isDeleted?: Scalars['Boolean']
  paymentdDate?: Scalars['DateTime']
  discount?: Scalars['Boolean']
  items?: Array<BillingItem>
}

export type ItemDetail = {
  __typename?: 'ItemDetail'
  company?: Maybe<Scalars['String']>
  job?: Maybe<Scalars['String']>
  candidate?: Maybe<Scalars['String']>
}

export type InvoiceCollectionSegment = {
  __typename?: 'InvoiceCollectionSegment'
  items?: Maybe<Array<Invoice>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type BillingReport = {
  __typename?: 'BillingReport'
  invoiceNumber?: Maybe<Scalars['String']>
  billingNumber?: Scalars['String']
  companyName?: Scalars['String']
  jobName?: Scalars['String']
  companyContact?: Scalars['String']
  jobType?: Scalars['String']
  jobVertical?: Scalars['String']
  candidate?: Scalars['String']
  invoiced?: Scalars['Boolean']
  paid?: Scalars['Boolean']
  createdDate?: Maybe<Scalars['DateTime']>
  paymentdDate?: Maybe<Scalars['DateTime']>
  invoicedDate?: Maybe<Scalars['DateTime']>
}

export type BillingReportCollectionSegment = {
  __typename?: 'BillingReportCollectionSegment'
  items?: Maybe<Array<BillingReport>>
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo
  totalCount: Scalars['Int']
}

export type JobCandidateFilterInput = {
  jobId?: InputMaybe<Scalars['String']>
  applicantName?: InputMaybe<Scalars['String']>
  stageId?: InputMaybe<Scalars['String']>
  stageDescription?: InputMaybe<Scalars['String']>
  candidateEmail?: InputMaybe<Scalars['String']>
  candidateCellPhone?: InputMaybe<Scalars['String']>
  companyId?: InputMaybe<Scalars['String']>
  fromDate?: InputMaybe<Scalars['DateTime']>
  toDate?: InputMaybe<Scalars['DateTime']>
}

export type JobCandidateSortInput = {
  applicantName?: InputMaybe<SortEnumType>
  stageDescription?: InputMaybe<SortEnumType>
  stageId?: InputMaybe<SortEnumType>
  candidateEmail?: InputMaybe<SortEnumType>
  candidateCellPhone?: InputMaybe<SortEnumType>
  candidateCreatedDate?: InputMaybe<SortEnumType>
  candidateModificateDate?: InputMaybe<SortEnumType>
  lastActivity?: InputMaybe<SortEnumType>
  resumePath?: InputMaybe<SortEnumType>
}

export type BillingReportSortInput = {
  invoiceNumber?: InputMaybe<SortEnumType>
  billingNumber?: InputMaybe<SortEnumType>
  companyName?: InputMaybe<SortEnumType>
  jobName?: InputMaybe<SortEnumType>
  companyContact?: InputMaybe<SortEnumType>
  jobType?: InputMaybe<SortEnumType>
  jobVertical?: InputMaybe<SortEnumType>
  candidate?: InputMaybe<SortEnumType>
  invoiced?: InputMaybe<SortEnumType>
  paid?: InputMaybe<SortEnumType>
  createdDate?: InputMaybe<SortEnumType>
  paymentdDate?: InputMaybe<SortEnumType>
  invoicedDate?: InputMaybe<SortEnumType>
}

export type BillingReportSort = {
  __typename?: 'BillingReport'
  invoiceNumber?: Maybe<Scalars['String']>
  billingNumber?: Scalars['String']
  companyName?: Scalars['String']
  jobName?: Scalars['String']
  companyContact?: Scalars['String']
  jobType?: Scalars['String']
  jobVertical?: Scalars['String']
  candidate?: Scalars['String']
  invoiced?: Scalars['Boolean']
  paid?: Scalars['Boolean']
  createdDate?: Maybe<Scalars['DateTime']>
  paymentdDate?: Maybe<Scalars['DateTime']>
  invoicedDate?: Maybe<Scalars['DateTime']>
}
