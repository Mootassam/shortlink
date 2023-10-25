import moment from "moment";

class Date {
  static createdAt() {
    // Create a Date object using moment
    const date = moment().toDate();
    // Format the date for display
    const formattedDate = moment(date)
      .utcOffset(4)
      .format("D MMMM YYYY [à] HH:mm:ss [UTC+4]");
    return formattedDate;
  }

  static now() {
    return moment().toDate();
  }

  static format(date: any) {
    const formattedDate = moment(
      date,
      "D MMMM YYYY [à] HH:mm:ss [UTCZ]"
    ).format("MMM-DD-YYYY");

    return formattedDate;
  }
}

export default Date;
