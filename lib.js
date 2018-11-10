'use strict';

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError('\'filter\' must be instance of Filter!');
    }
    this._friends = this._getCircles(friends, this._maxLevel)
        .filter(filter.check);
}

const compareNames = (a, b) => a.name.localeCompare(b.name);

function getNextCircle(currentCircle, circles, friends) {
    const nextCircle = [];

    currentCircle.forEach(_ =>
        _.friends.forEach(name => {
            const friend = friends.find(person => person.name === name);
            if (!circles.includes(friend)) {
                nextCircle.push(friend);
            }
        }));

    return [...new Set(nextCircle)].sort(compareNames);
}

Iterator.prototype = {
    constructor: Iterator,
    _getCircles(friends, maxLevel = Infinity) {
        let currentCircle = friends.filter(_ => _.best).sort(compareNames);
        const circles = [];

        while (currentCircle.length > 0 && maxLevel > 0) {
            circles.push(...currentCircle);
            currentCircle = getNextCircle(currentCircle, circles, friends);
            maxLevel--;
        }

        return circles;
    },
    done() {
        return this._friends.length === 0;
    },
    next() {
        return this.done() ? null : this._friends.shift();
    }
};

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    this._maxLevel = maxLevel;
    Iterator.call(this, friends, filter);
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    console.info('Filter');
}

Filter.prototype.check = () => true;

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    console.info('MaleFilter');
}

MaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: MaleFilter
    },
    check: {
        value: friend => friend.gender === 'male'
    }
});

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    console.info('FemaleFilter');
}

FemaleFilter.prototype = Object.create(Filter.prototype, {
    constructor: {
        value: FemaleFilter
    },
    check: {
        value: friend => friend.gender === 'female'
    }
});

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
