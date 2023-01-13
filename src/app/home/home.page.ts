import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { BleClient, BluetoothLe } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  devices:any[]=[];
  ble:boolean=false;
  scanText:string="";
  constructor(private change:ChangeDetectorRef) {}

  ngOnInit(){
    BleClient.initialize().then(()=>{
      BleClient.isEnabled().then((res)=>{
        if(res){
          this.ble = true;
        }else {
          this.ble = false;
        }
      })
    })
  }

  toggleBle(event) {
    if(this.ble){
      this.enableBluetooth();
    }else {
      this.disableBluetooth();
    }
  }
  enableBluetooth() {
    BleClient.enable();
  }
  disableBluetooth() {
    BleClient.disable();
  }
  startScanning() {
    this.scanText = "scanning...";

    BleClient.requestLEScan({allowDuplicates:false}, (res1)=> {
      if(res1.localName) {
        this.devices.push(res1);
        this.change.detectChanges();
      }
    })

    setTimeout(()=> {
      this.stopScanning();
    },20000)
  }

  stopScanning() {
    BluetoothLe.stopLEScan().then(()=>{
      this.scanText = "";
    })
  }

  connect( device, index ) {
    BleClient.connect(device.device.deviceId).then(()=>{
      this.devices[index]["connection"] = true;
      this.change.detectChanges();

      alert("connected!");
    },(err)=>{
      alert(err);
    })
  }

  disconnect(device, index) {
    BleClient.disconnect(device.device.deviceId).then(()=>{
      this.devices[index]["connection"] = false;
      this.change.detectChanges();
      alert("disconnected!");
    })
  }

}
