/*
  @author Guido Arce
  @description Requisition api
*/

import {getRequisitionUrl} from 'utility'
import {apiFactory} from 'lib/utility/api'
import {Requisition} from 'type/requisition'

const getRequisitionApi = apiFactory(getRequisitionUrl(`api/Requisition/details`))
//const postRequisitionApi = apiFactory(getRequisitionUrl(`api/Requisition/create`))
//const putRequisitionApi = apiFactory(getRequisitionUrl(`api/Requisition/update`))
//const deleteRequisitionApi = apiFactory(getRequisitionUrl(`api/Requisition/delete`))

const getRequisition = (requisitionId?: number) =>
    getRequisitionApi.get<Requisition[]>(requisitionId ? {requisitionId: requisitionId.toString()} : {})

  export {getRequisition}
