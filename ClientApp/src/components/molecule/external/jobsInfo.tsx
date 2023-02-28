import {useState, useEffect} from 'react'

import {useHistory} from 'react-router'
import {useDispatch} from 'react-redux'
import {setSpinner} from 'store/action/globalActions'
import {externalRoutes} from 'router/externalRouter'
import {Grid, Link, Container, makeStyles, Box, TextField} from '@material-ui/core'

import {spacing, hrmangoColors, typography} from 'lib/hrmangoTheme'
import {useGetJobsQuery} from 'graphql/Jobs/Queries/GetJobsQuery.generated'
import {JobSortInput, JobFilterInput, SortEnumType} from 'graphql/types.generated'
import JobCard from './jobCard'

const useStyles = makeStyles(() => ({
  dataContainer: {
    ...typography.h5,
    padding: `${spacing[24]}px 0px 0px`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  filter: {
    paddingTop: spacing[16],
    borderBottom: hrmangoColors.tableBorderStyle
  },
  row: {
    display: 'flex',
    paddingLeft: spacing[48],
    paddingRight: spacing[48],
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px'
    },
    '& .MuiFormGroup-root': {
      flexWrap: 'nowrap'
    }
  },
  rowSpace: {
    padding: spacing[32]
  },
  textField: {
    '& .MuiFilledInput-input': {
      padding: '16px 13px'
    }
  },
  search: {
    ...typography.subtitle1,
    padding: '32px 13px',
    width: '40%'
  }
}))

const JobsInfo = () => {
  type SortCol = keyof Pick<
    JobSortInput,
    'id' | 'jobName' | 'companyName' | 'status' | 'jobOwnerShip' | 'jobType' | 'modifiedDate'
  >

  const [orderByCol] = useState<SortCol>('modifiedDate')
  const [orderDir] = useState<SortEnumType>(SortEnumType.Desc)
  const [filters, setFilters] = useState<JobFilterInput>()
  const [result, setResult] = useState<any>()
  const dispatch = useDispatch()
  const classes = useStyles()

  const {data, isFetching, isSuccess, refetch} = useGetJobsQuery(
    {
      filter: {...filters},
      order: {[orderByCol]: orderDir},
      skip: 0,
      take: 50
    },
    {
      enabled: true,
      refetchOnMount: 'always'
    }
  )

  useEffect(() => {
    dispatch(setSpinner(isFetching))
  }, [isFetching]) // eslint-disable-line

  const history = useHistory()
  //const items = data?.jobs?.items //?.filter((x) => x.timeFill === 0 || x.stageId === null)

  function groupBy(key) {
    return function group(array) {
      return array.reduce((acc, obj) => {
        const property = obj[key]
        acc[property] = acc[property] || []
        acc[property].push(obj)
        return acc
      }, {})
    }
  }

  useEffect(() => {
    const dataFiltered = data?.jobs?.items?.filter(
      (x) => x.statusId !== 8 && x.statusId !== 9 && x.statusId !== 10 && x.statusId !== 11
    )
    const groupByCompany = groupBy('jobVertical')
    const items = groupByCompany(dataFiltered ?? [])
    setResult(items)
  }, [data?.jobs?.items, isSuccess])

  const goToJobDetails = (row: any) => {
    //return <JobDetailPage job={row} />
    history.push(`${externalRoutes.JobDetail}`, {
      params: row
    })
  }

  return (
    <>
      <Container className={classes.filter}>
        <Box className={classes.row}>
          <span className={classes.search}>Search by: </span>
          <Box className={classes.rowSpace} />
          <TextField
            inputProps={{tabIndex: -1}}
            className={classes.textField}
            id='jobName'
            label='Job Name'
            margin='normal'
            variant='outlined'
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, jobName: e.target.value})
              refetch()
            }}
            fullWidth
          />
          <Box className={classes.rowSpace} />
          <TextField
            inputProps={{tabIndex: -1}}
            className={classes.textField}
            id='city'
            label='City'
            margin='normal'
            variant='outlined'
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, city: e.target.value})
              refetch()
            }}
            fullWidth
          />
          <Box className={classes.rowSpace} />
          <TextField
            inputProps={{tabIndex: -1}}
            className={classes.textField}
            id='state'
            label='State'
            margin='normal'
            variant='outlined'
            onChange={(e: any) => {
              e.target.value.length < 257 && setFilters({...filters!, state: e.target.value})
              refetch()
            }}
            fullWidth
          />
        </Box>
      </Container>
      {Object.keys(result ?? []).map(function (key) {
        return (
          <>
            <span key={`jobType-${key}`} className={classes.dataContainer}>
              {key}
            </span>
            <span key={`jobNumber-${key}`}>{`(${result[key]?.length}) Jobs`}</span>
            <Grid key={`grid-${key}`} container item xs={12} spacing={2}>
              {result &&
                result[key]?.map((job) => (
                  <Grid key={`jobGrid-${job.id}`} item xs={3} sm={3} md={3} lg={4} xl={3}>
                    <Link style={{cursor: 'pointer'}} key={`jobLink-${job.id}`} onClick={() => goToJobDetails(job)}>
                      <JobCard
                        id={job?.id}
                        description={job?.jobExternalType}
                        name={job?.jobName}
                        city={job?.city}
                        state={job?.state}
                        country={job?.territory}
                      />
                    </Link>
                  </Grid>
                ))}
            </Grid>
          </>
        )
      })}
    </>
  )
}

export {JobsInfo}
