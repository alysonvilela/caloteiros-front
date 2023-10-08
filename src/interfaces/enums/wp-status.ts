export enum WpStatus {
   STOPPED, 
   STARTING, 
   SCAN_QR_CODE, 
   WORKING, 
   FAILED
 }
 
export type IWpStatus = keyof typeof WpStatus