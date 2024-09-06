import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class Utils {
    constructor() { }

    static timeToSeconds(time: string): number {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    static getCurrentTimeInSeconds(): number {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }

    static formatSeconds(seconds: number) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedTime = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            remainingSeconds.toString().padStart(2, '0')
        ].join(':');

        return formattedTime;
    }

    static convertToUnixTime(date: string, time: string): number {
        // Kết hợp date và time thành một chuỗi định dạng phù hợp cho Date object
        const dateTimeString = `${date}T${time}`;

        // Tạo đối tượng Date từ chuỗi kết hợp
        const dateTime = new Date(dateTimeString);

        // Chuyển đổi thành Unix time (millisecond)
        const unixTime = dateTime.getTime(); // Chia cho 1000 để chuyển từ millisecond sang second

        return unixTime // Sử dụng Math.floor để làm tròn thành số nguyên
    }

}