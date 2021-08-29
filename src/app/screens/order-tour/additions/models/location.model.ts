export class LocationModel {

  constructor(
    public pickUpDate?: Date,
    public pickupLocation?: string,
    public dropdownLocation?: string
  ) {
    this.pickUpDate = this.pickUpDate || new Date()
    this.pickupLocation = this.pickupLocation || 'הכנס מקום'
    this.dropdownLocation = this.dropdownLocation || 'הכנס מקום'

  }

}
