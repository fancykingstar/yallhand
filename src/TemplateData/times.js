export const times = [
  {
    text: "12:00 AM",
    value: "00:00"
  },
  {
    text: "1:00 AM",
    value: "01:00"
  },
  {
    text: "2:00 AM",
    value: "02:00"
  },
  {
    text: "3:00 AM",
    value: "03:00"
  },
  {
    text: "4:00 AM",
    value: "04:00"
  },
  {
    text: "5:00 AM",
    value: "05:00"
  },
  {
    text: "6:00 AM",
    value: "06:00"
  },
  {
    text: "7:00 AM",
    value: "07:00"
  },
  {
    text: "8:00 AM",
    value: "08:00"
  },
  {
    text: "9:00 AM",
    value: "09:00"
  },
  {
    text: "10:00 AM",
    value: "10:00"
  },
  {
    text: "11:00 AM",
    value: "11:00"
  },
  {
    text: "12:00 PM",
    value: "12:00"
  },
  {
    text: "1:00 PM",
    value: "13:00"
  },
  {
    text: "2:00 PM",
    value: "14:00"
  },
  {
    text: "3:00 PM",
    value: "15:00"
  },
  {
    text: "4:00 PM",
    value: "16:00"
  },
  {
    text: "5:00 PM",
    value: "17:00"
  },
  {
    text: "6:00 PM",
    value: "18:00"
  },
  {
    text: "7:00 PM",
    value: "19:00"
  },
  {
    text: "8:00 PM",
    value: "20:00"
  },
  {
    text: "9:00 PM",
    value: "21:00"
  },
  {
    text: "10:00 PM",
    value: "22:00"
  },
  {
    text: "11:00 PM",
    value: "23:00"
  }
];

export const adjustedTime = (startValue, delta) => {
  const values = times.map(time => time.value);
  if (values.indexOf(startValue) + Math.abs(delta) < 0) {
    return [...values, ...values][values.indexOf(startValue) + Math.abs(delta)];
  } else {
    return values[values.indexOf(startValue) + Math.abs(delta)];
  }
};
