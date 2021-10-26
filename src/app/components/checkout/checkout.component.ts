import { Country } from './../../common/country';
import { Tu4nnguyenShopFormService } from './../../services/tu4nnguyen-shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { State } from 'src/app/common/state';
import { Tu4nnguyenValidators } from 'src/app/validators/tu4nnguyen-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private Tu4nnguyenShopFormService: Tu4nnguyenShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                              [Validators.required, 
                               Validators.minLength(2), 
                               Tu4nnguyenValidators.notOnlyWhitespace]),

        lastName:  new FormControl('', 
                              [Validators.required, 
                               Validators.minLength(2), 
                               Tu4nnguyenValidators.notOnlyWhitespace]),
                               
        email: new FormControl('',
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                              [Validators.required, Validators.minLength(2), 
                               Tu4nnguyenValidators.notOnlyWhitespace]),
        city: new FormControl('', 
                               [Validators.required, Validators.minLength(2), 
                                Tu4nnguyenValidators.notOnlyWhitespace]),
        state: new FormControl('', 
                              [Validators.required]),
        country: new FormControl('', 
                              [Validators.required]),
        zipCode: new FormControl('', 
                              [Validators.required, 
                               Validators.minLength(2), 
                               Tu4nnguyenValidators.notOnlyWhitespace])
      }),     
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })                                          
    });


    // polulate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startmonth: " + startMonth);

    this.Tu4nnguyenShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    // polulate credit card years

    this.Tu4nnguyenShopFormService.getCreditCardYers().subscribe(
      data => {
        console.log("Retrieved credit card years: "+ JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // poluate countries

    this.Tu4nnguyenShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
    }
  );
}

get firstName(){ return this.checkoutFormGroup.get('customer.firstName')!; }
get lastName(){ return this.checkoutFormGroup.get('customer.lastName')!; }
get email(){ return this.checkoutFormGroup.get('customer.email')!; }

get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street')!; }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city')!; }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state')!; }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode')!; }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country')!; }
  

  copyShippingAddressToBillingAddress(event:any){

    if (event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

    // bug fix for states
    this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  onSubmit(){

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log("Handling the sumbit button");
    console.log(this.checkoutFormGroup.get('customer')!.value);
    console.log("The email address is "+this.checkoutFormGroup.get('customer')!.value.email);

    console.log("The shipping address country is "+this.checkoutFormGroup.get('shippingAddress')!.value.country.name);
    console.log("The shipping address state is "+this.checkoutFormGroup.get('shippingAddress')!.value.state.name)
  }

  handleMonthsAndYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }    
    else{
      startMonth = 1;
    }                
    
    this.Tu4nnguyenShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify);
        this.creditCardMonths = data;
      }
    )
  }
          
  getStates(FormGroupName: string){

    const formGroup = this.checkoutFormGroup.get(FormGroupName);

    const countryCode = formGroup!.value.country.code;
    console.log(`${FormGroupName} country code: ${countryCode}`);
    const countryName = formGroup!.value.country.name;
    console.log(`${FormGroupName} country name: ${countryName}`);  
  

  this.Tu4nnguyenShopFormService.getStates(countryCode).subscribe(
    data => {
      if (FormGroupName === 'shippingAddress'){
        this.shippingAddressStates = data;
      }
      else{
        this.billingAddressStates = data;
      }

      // select first item by default
      formGroup!.get('state')!.setValue(data[0]);
      }
    );
  }
} 
