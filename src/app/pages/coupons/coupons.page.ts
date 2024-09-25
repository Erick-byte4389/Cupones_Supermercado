import { Component, OnInit } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner';
import { NavController, NavParams } from '@ionic/angular';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from 'src/services/coupons.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  public couponsActive: boolean;
  public coupons: Coupon[];

  constructor(
    private couponsService: CouponsService,
    private navParams: NavParams,
    private navController: NavController,
    private toastService: ToastService
  ) { 
    this.coupons = [];
    this.couponsActive = false;
  }

  ngOnInit() {
    this.couponsService.getCoupons().then( (coupons: Coupon[]) => {
      this.coupons = coupons;
      console.log(this.coupons);
      
    })
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.couponsActive = this.coupons.some(c => c.active
    );
  }

  goToCard() {
    this.navParams.data["coupons"] = this.coupons.filter(c => c.active);
    this.navController.navigateForward('card-coupon');
  }

  startCamera() {

    CapacitorBarcodeScanner.scanBarcode({
      hint: 0
    }).then( (value: CapacitorBarcodeScannerScanResult) => {
      const result = value.ScanResult;

      try {
        let coupon: Coupon = JSON.parse(result);

        if (this.isCouponValid(coupon)) {
          this.toastService.showToast('QR escaneado con éxito')
          this.coupons.push(coupon);
        } else {
          this.toastService.showToast('QR invalido')
        }
      } catch (error) {
        this.toastService.showToast('QR error')
        console.error(error);
        
      }
      
    })

  }

  private isCouponValid(coupon: Coupon) {
    return coupon && coupon.id_Product && coupon.img && coupon.name && coupon.discount;
  }

}
