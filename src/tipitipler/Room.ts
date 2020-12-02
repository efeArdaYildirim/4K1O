type Room = JSON &
  Object & {
    id: string;

    title: string;
    explain: string;
    owner: string;
    isActive: false;
    price: number;
    rank?: number;
    look?: number;
    like: number;
    dislike: number;
    m2: number;
    location: {
      country: string | any;
      city: string | any;
      neighborhood: string | any;
      street: string | any;
      municipality: string | any;
      zipCode: string | any;
      No: number;
      door: number;
      mapsLink: string;
      title: string;
    };
    imgs: [
      {
        url: string;
        alt: number;
        lastChange: Date;
      }
    ];
  };

type Rooms = Array<Room>;

export { Room, Rooms };
