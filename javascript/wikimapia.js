/**
 * Wikimapia API JavaScript Client Class for MooTools 1.2
 * 
 * @package Wikimapia API
 * @author Wikimapia API Stuff
 * @version 0.1
 * @tutorial http://wikimapia.org/api/
 * @requires Class, Hash, Request, Request.JSON
 */
Request.WikimapiaAPI = new Class({
    Extends : Request,
    options : {
        /**
         * Wikimapia API URL Do not change this!
         * 
         * @type {String}
         */
        url : 'http://api.wikimapia.org/',
        /**
         * This is your Wikimapia API Key.
         * 
         * If you do not have the key, you can not use the API. You can get it
         * for free by registering on wikimapia.org, and easily create a key on
         * this page: http://wikimapia.org/api/
         * 
         * @type {String}
         */
        key : '',
        /**
         * Wikimapia Output format For now we support: xml, json, kml, binary
         * Default: xml
         * 
         * @type {String}
         */
        format : 'xml',
        /**
         * Packing output data parameter. For now we support: gzip, none
         * Default: none
         * 
         * @type {String}
         */
        packing : 'none',
        /**
         * Response language.
         * 
         * @type {String}
         */
        language : 'en',
        /**
         * This is an option to disable the output of various parameters. You
         * can disable fields for xml, json(p) formats. Allowed fields to
         * disable: location, polygon.
         */
        disable : null,
        /**
         * 
         * @type Boolean
         */
        secure : true,
        async : false,
        method : 'get',
        data : ''
    /*
     * onRequest: $empty, onComplete: $empty, onCancel: $empty, onSuccess:
     * $empty, onFailure: $empty, onException: $empty,
     */
    },
    /**
     * @constructor
     * @param {Object}
     *            options
     */
    initialize : function(options) {
        this.parent(options);
    },
    /**
     * Send method override
     * 
     * @param {Object/String}
     *            options
     */
    send : function(options) {
        if (this.options.format == 'json') {
            this.headers.extend({
                'Accept' : 'application/json',
                'X-Request' : 'JSON'
            });
        }
        options = options.toQueryString();
        this.parent(options);
    },
    success : function(text, xml) {
        if (this.options.format == 'json') {
            this.response.json = JSON.decode(text, this.options.secure);
            this.onSuccess(this.response.json, text);
        } else {
            this.onSuccess(this.processScripts(text), xml);
        }
    },
    /**
     * Function to get Object data by its ID
     * 
     * @param {Number}
     *            objectId Object identifier
     * @param {string}
     *            language Output language (defaults to 'en' - English)
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectById : function(objectId, lang) {
        if (lang) {
            this.options.lang = lang;
        }
        return this.send(this.formatRequest({
            func : "object",
            id : objectId
        }));
    },
    /**
     * This is a synonym of getObjectsInBoxByLatLon
     * 
     * @param {Number}
     *            minLng West longitude.
     * @param {Number}
     *            minLat South latitude.
     * @param {Number}
     *            maxLng East longitude.
     * @param {Number}
     *            maxLat North latitude.
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectInBox : function(minLng, minLat, maxLng, maxLat) {
        return this.getObjectsInBoxByLatLon(minLng, minLat, maxLng, maxLat);
    },
    /**
     * Get objects in box by latitude and longitude
     * 
     * @param {Number}
     *            minLng Minimum longitude
     * @param {Number}
     *            minLat Minimum latitude
     * @param {Number}
     *            maxLng Maximum longitude
     * @param {Number}
     *            maxLat Maximum latitude
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectsInBoxByLatLon : function(minLng, minLat, maxLng, maxLat) {
        return this.send(this.formatRequest({
            func : "box",
            lon_min : minLng,
            lat_min : minLat,
            lon_max : maxLng,
            lat_max : maxLat
        }));
    },
    /**
     * Get objects in box by latitude and longitude separated by comma
     * 
     * @param {String}
     *            bbox -> lon_min,lat_min,lon_max,lat_max
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectsInBoxByBBox : function(bbox) {
        return this.send(this.formatRequest({
            func : "box",
            bbox : bbox
        }));
    },
    /**
     * Get objects in box by tile coordinates
     * 
     * @param {Number}
     *            x
     * @param {Number}
     *            y
     * @param {Number}
     *            z
     * @param {Number}
     *          count
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectsInBoxByTile : function(x, y, z, count) {
        return this.send(this.formatRequest({
            func : "box",
            x : x,
            y : y,
            z : z,
            count : count || 50
        }));
    },
    /**
     * Get objects that intersects with point
     * 
     * @param {Number}
     *            x
     * @param {Number}
     *            y
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectsInPoint : function(x, y) {
        return this.send(this.formatRequest({
            func : "point",
            x : x,
            y : y
        }));
    },
    /**
     * Get objects that determines search query
     * 
     * @param {String}
     *            query
     * 
     * @return {Request.WikimapiaAPI}
     */
    getObjectsBySearchQuery : function(query, page) {
        return this.send(this.formatRequest({
            func : "search",
            q : query,
            page : page || 1
        }));
    },
    /**
     * Creates full API request hash including desired function, which must be
     * set, and combined with its arguments,
     * 
     * @param {Object}
     *            options
     * @return {Hash}
     */
    formatRequest : function(options) {
        var req = new Hash({
            "function" : options.func,
            "key" : this.options.key,
            "format" : this.options.format,
            "pack" : this.options.packing,
            "language" : this.options.language
        });
        delete options.func;
        return req.combine(options);
    }
});
