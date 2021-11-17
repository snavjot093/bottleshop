import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { orderBy } from 'lodash';
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
    transform(value:any, args?: any): any {
        if(!value)return null;
        if(!args)return value;
        args = args.toLowerCase();
        return value.filter(function(item:any){
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
    /* transform(value: any, args?: any): any {
        let uniqueArray =  Array.from(new Set(value));
            return uniqueArray;
        }*/
}

@Pipe({
  name: 'unique',
  pure: false
})

export class UniquePipe implements PipeTransform {
    transform(value:any): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, 'name');
        }
        return value;
    }
}
@Pipe({
  name: 'limitTo'
})
export class LimitTo implements PipeTransform {
  transform(value: string, args: string) : string {
    let limit = args ? parseInt(args, 10) : 10;
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}

@Pipe({
 name: "orderBy"
})
export class OrderByPipe  implements PipeTransform {
 transform(array: any, sortBy: string, order:any ): any[] {
 const sortOrder = order ? order : 'asc'; // setting default ascending order

  return orderBy(array, [sortBy], [sortOrder]);
  }
}
@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any[] {
    // prevents the application from breaking if the array of objects doesn't exist yet
    const groupedCollection = collection.reduce((previous, current)=> {
        if(!previous[current[property]]) {
            previous[current[property]] = [current];
        } else {
            previous[current[property]].push(current);
        }

        return previous;

    }, {});
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
}

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29)
                return 'Just now';
            const intervals:any = {
                'year': 31536000,
                'month': 2592000,
                'week': 604800,
                'day': 86400,
                'hour': 3600,
                'minute': 60,
                'second': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' ago';
                    } else {
                        return counter + ' ' + i + 's ago';
                    }
            }
        }
        return value;
    }
}
@Pipe({
    name: 'ifEmpty',
    pure: true
})
export class Ifempty implements PipeTransform {
    transform(value: any, args: any) : any {
        return function (value:any, args:any) {
            if (value === undefined || value === null || value === '') {
                return args;
            }
            return value;
        };
    }
}
