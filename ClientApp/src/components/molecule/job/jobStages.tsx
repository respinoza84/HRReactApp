import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useMutation} from 'react-query'
import {LocationState} from 'type'
import {withRouter, RouteComponentProps, StaticContext} from 'react-router'
import {Box, Container, Button} from '@material-ui/core'
import {makeStyles, Theme} from '@material-ui/core/styles'
import {spacing, typography, shadows, hrmangoColors} from 'lib/hrmangoTheme'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {useGetApplicantsByJobIdAsyncQuery} from 'graphql/Jobs/Queries/GetApplicantsByJobId.generated'
import {Applicant} from 'graphql/types.generated'
import {setSpinner, resetToasts, setToast} from 'store/action/globalActions'
import {format, addMinutes} from 'date-fns'
import {addCandidate} from 'api/jobApi'
import {routes} from 'router'
import {
  List,
  Apps,
  Send,
  AttachFile,
  Description,
  LocalOffer,
  ThumbDown,
  ThumbUp,
  AssignmentInd
} from '@material-ui/icons'
import StageChangeModal from './stageChangeModal'
import ResumeModal from './resumeModal'
import {ActivityTable} from './activityTable'
import {Add} from '@material-ui/icons'
import CandidateModal from './candidateModal'
import {SearchCandidate} from './searchCandidate'
import ApplicantModal from './applicantModal'
import {useGetActivitiesByEntityQuery} from 'graphql/Actions/GetNoteByEntityIdAndIdQuery.generated'

type StagesType = {
  order: number
  id: number
  item: string
  color: string
  icon: any
}
const defaultApplicant = {
  stageDate: undefined,
  stageId: 0,
  jobId: 0,
  candidateId: undefined,
  note: undefined,
  offerStatus: undefined,
  nonSelecctionReason: undefined,
  timeStart: undefined,
  amount: 0,
  jobType: ''
}
const defaultCandidate = {
  applicationDate: undefined,
  stageId: 0
}
const stages: StagesType[] = [
  {
    order: 0,
    id: 0,
    item: 'Application',
    color: '#967ADC',
    icon: <Apps fontSize='small' />
  },
  {
    order: 1,
    id: 8,
    item: 'Attempted Contact',
    color: '#0091D0',
    icon: <ThumbUp fontSize='small' />
  },
  {
    order: 2,
    id: 1,
    item: 'Pre Screen',
    color: '#5BC24C',
    icon: <List fontSize='small' />
  },
  {
    order: 3,
    id: 2,
    item: 'Manager Reply',
    color: '#F5B025',
    icon: <Send fontSize='small' />
  },
  {
    order: 4,
    id: 3,
    item: 'Interview',
    color: '#E9573F',
    icon: <Description fontSize='small' />
  },
  {
    order: 5,
    id: 4,
    item: 'Offer',
    color: '#4154BF',
    icon: <LocalOffer fontSize='small' />
  },
  {
    order: 6,
    id: 5,
    item: 'Hire',
    color: '#967ADC',
    icon: <ThumbUp fontSize='small' />
  },
  {
    order: 7,
    id: 6,
    item: 'Rejected',
    color: '#0091D0',
    icon: <ThumbDown fontSize='small' />
  }
]
export const getStages = (order): StagesType | undefined => stages.find((item) => item.order === order)
const JobStages = withRouter(
  ({match, location, history}: RouteComponentProps<{jobId: string}, StaticContext, LocationState>) => {
    const useStyles = (bColor?: string | undefined) =>
      makeStyles((theme: Theme) => ({
        filter: {
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: hrmangoColors.tableBorderStyle,
          color: hrmangoColors.dark,
          backgroundColor: hrmangoColors.white,
          padding: spacing[0]
        },
        rowHeader: {
          paddingBottom: spacing[24],
          ...typography.h6
        },
        content: {
          display: 'flex',
          justifyContent: 'end'
        },
        textField: {
          '& .MuiFilledInput-input': {
            padding: '16px 13px'
          }
        },
        button: {
          ...typography.buttonGreen,
          marginBottom: spacing[24],
          textTransform: 'capitalize'
        },
        menuItem: {
          '&:focus': {
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              color: hrmangoColors.lightGray
            }
          }
        },
        overline: {
          ...typography.overline
        },
        stageHeader: {
          //backgroundColor: bColor ?? '#0091D0',
          color: hrmangoColors.white,
          //margin: spacing[8],
          display: 'inline-flex',
          padding: spacing[8],
          flexDirection: 'row',
          flex: 1,
          flexWrap: 'wrap',
          width: '97%',
          border: '2px solid ' + hrmangoColors.white,
          ...typography.h7
        },
        space: {
          margin: spacing[8],
          '& .MuiBox-root': {
            margin: spacing[8]
          }
        },
        item: {
          ...typography.body1,
          textTransform: 'capitalize'
        }
      }))
    const classes = useStyles
    const dispatch = useDispatch()
    const [state, setState] = useState<any>([[], [], [], [], [], [], [], []])
    const [stageChangeModalOpen, setStageChangeModalOpen] = useState(false)
    const [resumeOpen, setResumeModalOpen] = useState(false)
    const [applicant, setApplicant] = useState<Applicant>(defaultApplicant)
    const [candidate, setCandidate] = useState<Applicant>(defaultCandidate)
    const [candidateModalOpen, setCandidateModalOpen] = useState(false)
    const [applicantModalOpen, setApplicantModalOpen] = useState(false)
    const [toggleSearch, setToggleSearch] = useState<boolean>(false)
    const [selectedValue, setSelectedValue] = useState<any>({})
    const {data, isSuccess, isFetching, refetch} = useGetApplicantsByJobIdAsyncQuery(
      {
        jobId: parseInt(match.params.jobId),
        skip: 0,
        take: 10000
      },
      {
        enabled: true,
        refetchOnMount: 'always'
      }
    )
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [totalRows, setTotalRows] = useState(0)
    const [page, setPage] = useState(0)
    const {
      data: activities,
      isSuccess: isSuccessActivities,
      isFetching: isFetchingActivities,
      refetch: refetchActivities
    } = useGetActivitiesByEntityQuery(
      {
        entityId: parseInt(match.params.jobId),
        entityName: 'Stage',
        skip: page * rowsPerPage,
        take: rowsPerPage
      },
      {
        enabled: true,
        refetchOnMount: 'always',
        refetchOnReconnect: 'always'
      }
    )
    useEffect(() => {
      setTotalRows(activities?.activitiesByEntity?.totalCount ?? 0)
    }, [activities?.activitiesByEntity?.totalCount, isSuccess])
    const addApplicant = useMutation(() => addCandidate(match.params.jobId, selectedValue.id, {...candidate}), {
      onMutate: () => {
        dispatch(setSpinner(true))
      },
      onError: (error) => {
        dispatch(setSpinner(false))
        dispatch(
          setToast({
            message: `Error adding the candidate`,
            type: 'error'
          })
        )
      },
      onSuccess: (data: any) => {
        dispatch(setSpinner(false))
        data.json().then((candidate) => {
          dispatch(
            setToast({
              message: `${selectedValue.displayAs} successfully added`,
              type: 'success'
            })
          )
          setApplicantModalOpen(false)
          refetch()
        })
      },
      retry: 0
    })
    useEffect(() => {
      const newState = [...state]
      newState[0] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 0 || x.stageId === null)
      newState[1] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 8)
      newState[2] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 1)
      newState[3] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 2)
      newState[4] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 3)
      newState[5] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 4)
      newState[6] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 5)
      newState[7] = data?.applicantsByJobId?.items?.filter((x) => x.stageId === 6)
      setState(newState)
    }, [data, isSuccess, stageChangeModalOpen]) // eslint-disable-line
    useEffect(() => {
      dispatch(setSpinner(isFetching))
    }, [isFetching]) // eslint-disable-line
    const grid = 8
    /**
     * Moves an item from one list to another list.
     */
    const move = (source, destination, droppableSource, droppableDestination) => {
      const sourceClone = Array.from(source)
      const destClone = Array.from(destination)
      const [removed] = sourceClone.splice(droppableSource.index, 1)
      destClone.splice(droppableDestination.index, 0, removed)
      const result = {}
      result[droppableSource.droppableId] = sourceClone
      result[droppableDestination.droppableId] = destClone
      return result
    }
    const previous = (source, droppableSource, droppableDestination) => {
      setStageChangeModalOpen(true)
      const sourceClone = Array.from(source)
      const [removed] = sourceClone.splice(droppableSource.index, 1)
      const timeStart = new Date((removed as Applicant).timeStart)
      const formattedTimeStart =
        (removed as Applicant).timeStart &&
        format(addMinutes(timeStart, timeStart.getTimezoneOffset()), "yyyy-MM-dd'T'HH:mm")
      setApplicant({
        ...applicant!,
        stageId: getStages(parseInt(droppableDestination.droppableId))?.id, //parseInt(droppableDestination.droppableId),
        jobId: parseInt(match.params.jobId),
        candidateId: (removed as Applicant).candidateId,
        note: (removed as Applicant).note,
        offerStatus: (removed as Applicant).offerStatus,
        nonSelecctionReason: (removed as Applicant).nonSelecctionReason,
        timeStart: formattedTimeStart ?? format(new Date(), "yyyy-MM-dd'T'HH:mm")
      })
    }
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }
    function onDragEnd(result) {
      const {source, destination} = result
      // dropped outside the list
      if (!destination) {
        return
      }
      const sInd = +source.droppableId
      const dInd = +destination.droppableId
      if (sInd === dInd) {
        const items = reorder(state[sInd], source.index, destination.index)
        const newState = [...state]
        newState[sInd] = items
        setState(newState)
      } else {
        previous(state[sInd], source, destination)
        const result = move(state[sInd], state[dInd], source, destination)
        const newState = [...state]
        newState[sInd] = result[sInd]
        newState[dInd] = result[dInd]
        setState(newState.filter((group) => 7))
      }
    }
    const getListStyle = (isDraggingOver, color) => ({
      background: isDraggingOver ? 'lightblue' : color,
      boxShadow: shadows[20],
      borderTopRightRadius: '24px',
      borderTopLeftRadius: '24px',
      opacity: 0.7,
      paddingBottom: '1px',
      width: '-webkit-fill-available',
      minWidth: '165px'
    })
    const getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      padding: grid * 2,
      margin: `16px 8px 16px 8px`,
      borderRadius: '8px',
      // change background colour if dragging
      background: isDragging ? 'lightgreen' : hrmangoColors.lightGray,
      // styles we need to apply on draggables
      ...draggableStyle
    })
    const goToCandidateDetails = (row: any) => {
      history.push(`${routes.CandidateDetail}/${row.candidateId}`, {
        header: {
          title: row.applicantName,
          owner: row.owner,
          type: row.workType,
          color: location && location.state && location.state.header?.color
        },
        backUrl: history.location.pathname,
        backState: history.location.state
      })
    }
    return (
      <div>
        <Container>
          <Box className={classes()().rowHeader}>Job Stages</Box>
          <Box className={classes()().filter} color='secundary'>
            <Box style={{display: 'flex', justifyContent: 'space-between'}}>
              <SearchCandidate
                setToast={setToast}
                resetToasts={resetToasts}
                setToggleSearchOff={() => setToggleSearch(false)}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
              />
              <Button
                type='submit'
                variant='contained'
                className={classes()().button}
                disabled={toggleSearch}
                onClick={() => setApplicantModalOpen(true)}
              >
                <AssignmentInd fontSize='small' color='inherit' />
                <Box>Assign</Box>
              </Button>
            </Box>
            <Button
              size='large'
              type='submit'
              variant='contained'
              className={classes()().button}
              disabled={toggleSearch}
              onClick={() => {
                setCandidateModalOpen(true)
              }}
            >
              <Add fontSize='small' color='inherit' />
              <Box>Add Candidate</Box>
            </Button>
          </Box>
          <div style={{display: 'inline-flex', minWidth: '-webkit-fill-available', marginTop: `${spacing[19]}px`}}>
            <DragDropContext onDragEnd={onDragEnd}>
              {state?.map((el, ind) => (
                <div key={`content-${ind}`} className={classes()().content}>
                  <Box key={`space-${ind}`} className={classes()().space} />
                  <Droppable key={ind} droppableId={`${ind}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver, getStages(ind)?.color)}
                        {...provided.droppableProps}
                      >
                        <div className={classes(getStages(ind)?.color)().stageHeader}>
                          <span>{getStages(ind)?.icon}</span>{' '}
                          <span style={{paddingLeft: spacing[4]}}>{getStages(ind)?.item}</span>
                        </div>
                        {el?.map((item, index) => (
                          <Draggable
                            key={item.candidateId.toString()}
                            draggableId={item.candidateId.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                  }}
                                >
                                  <span
                                    onClick={() => goToCandidateDetails(item)}
                                    className={classes()().item}
                                    style={{cursor: 'pointer', color: '#0091D0'}}
                                  >
                                    {item.applicantName}
                                  </span>
                                  <span className={classes()().overline}>{item.jobTitle}</span>
                                  <Button
                                    onClick={() => {
                                      setApplicant({...applicant!, candidateId: item.candidateId})
                                      setResumeModalOpen(true)
                                    }}
                                  >
                                    <AttachFile fontSize='small' />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          </div>
        </Container>
        <Container style={{paddingTop: spacing[24]}}>
          <ActivityTable
            data={activities}
            isSuccess={isSuccessActivities}
            isFetching={isFetchingActivities}
            refetch={refetchActivities}
            rowsPerPage={rowsPerPage}
            page={page}
            setRowsPerPage={setRowsPerPage}
            totalRows={totalRows}
            setPage={setPage}
          />
        </Container>
        <StageChangeModal
          open={stageChangeModalOpen}
          onClose={() => setStageChangeModalOpen(false)}
          applicant={applicant}
          setApplicant={setApplicant}
          refetch={refetch}
          refetchActivies={refetchActivities}
        />
        <ResumeModal open={resumeOpen} onClose={() => setResumeModalOpen(false)} candidateId={applicant.candidateId} />
        <ApplicantModal
          applicant={candidate}
          setApplicant={setCandidate}
          onSave={addApplicant}
          open={applicantModalOpen}
          onClose={() => setApplicantModalOpen(false)}
        />
        <CandidateModal
          open={candidateModalOpen}
          onClose={() => setCandidateModalOpen(false)}
          setSelectedValue={setSelectedValue}
          setApplicantModalOpen={setApplicantModalOpen}
        />
      </div>
    )
  }
)
export {JobStages}
