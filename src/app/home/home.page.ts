import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

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


  async startScanning() {
    this.scanText = "scanning...";

    await BleClient.requestLEScan({allowDuplicates:false}, (res1)=> {
      if(res1.localName) {
        this.devices.push(res1);
        this.change.detectChanges();
        console.log('new result', res1);
      }
    })

    setTimeout( ()=> {
      this.stopScanning();
      console.log('stopped scanning');
    },10000)
  }

  async stopScanning() {
    await BleClient.stopLEScan().then(()=>{
      this.scanText = "";
    })
  }

  connect( device: { device: { deviceId: string; }; } , index: string | number ) {
    BleClient.connect(device.device.deviceId).then(()=>{
      this.devices[index]["connection"] = true;
      this.change.detectChanges();

      alert("connected!");
    },(err)=>{
      alert(err);
    })
  }

  disconnect(device: { device: { deviceId: string; }; }, index: string | number) {
    BleClient.disconnect(device.device.deviceId).then(()=>{
      this.devices[index]["connection"] = false;
      this.change.detectChanges();
      alert("disconnected!");
    })
  }

}
