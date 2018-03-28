
let closest = function (list, x, cant) {
    let final_list = [];
    let final_cant = list.length > cant ? cant : list.length;

    let search_closest = function (x) {
        return list.sort(function (prev, next) {
            return Math.abs(x - prev.popularity) - Math.abs(x - next.popularity);
        }).splice(0, 1)[0];
    };

    let get = function () {
        if (final_list.length !== final_cant) {
            final_list.push(search_closest(x));
            return get();
        } else {
            return final_list;
        }
    };
    return get(x);
};

let alternate = function (list) {
    let index = 0;
    let list_size = list.length;
    let process = function (list_process) {
        // Search the next item different, remove and return this.
        let searchNextDifferent = function (number) {
            for (let i = index + 1; i <= list_size; i++) {
                if (list_process[i] && list_process[i].artists[0].id !== number) {
                    return list_process.splice(i, 1)[0];
                }
            };
        };
        // Search the next item different, remove and return this.
        let searchPrevDifferent = function (number, index) {
            for (let i = index - 1; i >= 0; i--) {
                if (list_process[i] &&
                    list_process[i].artists[0].id !== number &&
                    list_process[i].artists[0].id !== list_process[index].artists[0].id &&
                    number !== list_process[i - 1].artists[0].id &&
                    i) {
                    return list_process.splice(i, 1)[0];
                }
            };
        };
        // Check if the current item and the prev are equals
        if (list_process[index - 1] &&
            list_process[index - 1].artists[0].id == list_process[index].artists[0].id) {
            let next = searchNextDifferent(list_process[index].artists[0].id);
            if (next) {
                list_process.splice(index, 0, next);
            } else {
                let prev = searchPrevDifferent(list_process[index].artists[0].id, index);
                if (prev) {
                    list_process.splice(index - 1, 0, prev);
                } else {
                    list_process.push(list_process.splice(index, 1)[0]);
                }
            }
        }
        // next
        if (list_size - 1 !== index) {
            index++;
            return process(list_process);
        } else {
            return list_process;
        }
    };
    return process(list);
};

let orderByPopularity = (list) => {
    return list.sort((a, b) => {
        return a.popularity - b.popularity;
    }).reverse();
};

export function makePlaylist(list, points) {
    return alternate(orderByPopularity(closest(alternate(orderByPopularity(list)), points, 30)));
};
