export abstract class AbstractWorkFlowRepository {
  abstract workFlow(id: string): Promise<any>;
  abstract getAllWorkFlow(folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, work_flow_name: string): Promise<any>;
  //folder
  abstract folder(folder_name: string): Promise<any>;
  abstract getAllFolder(): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(id: string, folder_name: string): Promise<any>;
}

export abstract class AbstractWorkFlowService {
  abstract workFlow(id: string): Promise<any>;
  abstract getAllWorkFlow(folder_id: string): Promise<any>;
  abstract getWorkFlowById(id: string): Promise<any>;
  abstract updateWorkFlowById(id: string, work_flow_name: string): Promise<any>;
  //folder
  abstract folder(folder_name: string): Promise<any>;
  abstract getAllFolder(): Promise<any>;
  abstract getFolderById(id: string): Promise<any>;
  abstract updateFolderById(id: string, folder_name: string): Promise<any>;
}
