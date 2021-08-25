# Objective
To make a reservation system for end user to book an appointment for their vaccination. `Booking` is an association of: 
- The end user (`consumer`).
- The `center` or facility where the vaccination will take place.
- The `slot` or the date and time of the vaccination. 

## Features breakdown

### Registration
User should be able to register them self and **check** and **alter** their bookings.

- As a registered user he can exit flow anytime and come back to continue booking again.

### Centre selection
After registration user must be able to select a location from a list of centres provided.

### Slot selection
As a registered user, after choosing a centre there will be a number of slots provided by date from where user can select a slot and book it.
- slots are decided on the basis of staff available on that particular centre and an average time taken to vaccinate a person.
##### Assumptions around slot:
1. **Operating Hours**
```
8am to 10.30am - Operating Timings
11am to 12pm - Break Time
12pm to 4.30pm - Operating Timings
5pm to 6pm - Break Time
6pm to 8.30pm - Operating Timings
```
2. **All staffs are available in operating hours**
   
3. **Average time to vaccinate a person**
```
    2-4 minutes
    Let's average to 3 minutes.
```
1. **Waiting time after vaccination/slot duration**
``` 
    30 minutes
```

##### Center capacity per 30 minutes
```
let
   staff# = number of staff available on the date and time
   per30 = number of people can be vaccinated by one staff per 30 minutes
   avg =  Average time to vaccinate a person
   dur = slot duration
   cen30 = center capacity per slot
 
As mentioned above,
   avg = 3
   dur = 30

So,
   per30 = dur/avg = 30/3 = 10

Hence,
   if 1 staff is present on 2021-01-01 then:
        cen30 = staff# * per30 = 1 * 10
```
### Alter booking
User can use the same information they used to register to change their booking to another `centre` and another `date`.

## Out of scope
- Staff schedule management
- Centres management
- Real identity verification
- For simplicity it is considered that johnson and johnson vaccine is getting used, which only requires single dose. 
