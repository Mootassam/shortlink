import moment from "moment";

class Date {
  static createdAt() {
    const date = moment()
      .utcOffset(4)
      .format("D MMMM YYYY [à] HH:mm:ss [UTC+4]");
    return date;
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
