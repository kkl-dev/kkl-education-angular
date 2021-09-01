export class LocationModel {

  constructor(
    public pickUpDate?: Date,
    public pickUpHour?: Date,
    public pickupLocation?: string,
    public dropdownLocation?: string
  ) {
    this.pickUpDate = this.pickUpDate
    this.pickupLocation = this.pickupLocation || 'הכנס מקום'
    this.dropdownLocation = this.dropdownLocation || 'הכנס מקום'

  }

}
