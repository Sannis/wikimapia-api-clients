using System;
using System.IO;
using System.Net;
using System.Text;

namespace Wikimapia_API
{
    /**
     * Wikimapia API Java Client Class
     *
     * @package     Wikimapia API
     * @author      Wikimapia API Stuff
     * @version     0.1
     * @tutorial    http://wikimapia.org/api/
     */
    public class WikimapiaAPI
    {

        /**
         * Wikimapia API URL
         * Do not change this!
         */
        protected String m_Url = "http://api.wikimapia.org";

        /**
         * This is your Wikimapia API Key.
         *
         * If you do not have the key, you can not use the API.
         * You can get it for free by registering on wikimapia.org,
         * and easily create a key on this page:
         * http://wikimapia.org/api/
         */
        protected String m_Key;

        /**
         * Wikimapia Output format
         * For now we support: xml, json, kml, binary
         * Default: xml
         */
        protected String m_Format = "xml";

        /**
         * Packing output data parameter
         * For now we support: gz, none
         * Default: none
         */
        protected String m_Packing = "none";

        /**
         * Output data language
         */
        protected String m_Language = "en";

        /**
         * Object constructor
         * 
         * @param string $apiKey You wikimapia API key
         * @param string $format Output format
         */
        public WikimapiaAPI(String apiKey)
        {
            m_Key = apiKey;
        }

        /**
         * Set API output data format
         *
         * @tutorial http://wikimapia.org/api
         * @param   string $format
         * @return  boolean
         */
        public void setFormat(String format)
        {
            m_Format = format;
        }

        /**
         * Get selected output data format
         * 
         * @return string
         */
        public String getFormat()
        {
            return m_Format;
        }

        /**
         * Set API output data packing
         *
         * @tutorial http://wikimapia.org/api
         * @param   string $pack
         * @return  boolean
         */
        public void setPacking(String packing)
        {
            m_Packing = packing;
        }

        /**
         * Get selected packing
         * 
         * @return string
         */
        public String getPacking()
        {
            return m_Packing;
        }

        /**
         * Get output data language
         *
         * @return string
         */
        public String getLanguage()
        {
            return m_Language;
        }

        public void setLanguage(String language)
        {
            m_Language = language;
        }

        /**
         * Function to get Object data by its ID
         * @param int       $objectId   Object identifier
         * @param string    $language   Output language (default `en` - English)
         * 
         * @return string   Output data in selected format (see setFormat())
         */
        public String getObjectById(int objectId)
        {
            return doSendApiRequest("object", "&id=" + objectId);
        }

        /**
         * This is a alias of getObjectsInBoxByLatLon
         * 
         * @return string
         */
        public String getObjectInBox(float lon_min, float lat_min, float lon_max, float lat_max)
        {
            return getObjectsInBoxByLatLon(lon_min, lat_min, lon_max, lat_max);
        }

        /**
         * Get objects in box by latitude and longitude
         *
         * @param float $lon_min Minimum longitude
         * @param float $lat_min Minimum latitude
         * @param float $lon_max Maximum longitude
         * @param float $lat_max Maximum latitude
         * 
         * @return string
         */
        public String getObjectsInBoxByLatLon(float lon_min, float lat_min, float lon_max, float lat_max)
        {
            return doSendApiRequest("box", "&lon_min=" + lon_min + "&lat_min=" + lat_min + "&lon_max=" + lon_max + "&lat_max=" + lat_max);
        }

        /**
         * Get objects in box by latitude and longitude separated by comma
         *
         * @param string $bbox -> $lon_min,$lat_min,$lon_max,$lat_max
         * 
         * @return string
         */
        public String getObjectsInBoxByBBox(String bbox)
        {
            return doSendApiRequest("box", "&bbox=" + bbox);
        }

        /**
         * Get objects in box by tile coordinates
         *
         * @param int $x
         * @param int $y
         * @param int $z
         * 
         * @return string
         */
        public String getObjectsInBoxByTile(int x, int y, int z)
        {
            return doSendApiRequest("box", "&x=" + x + "&y=" + y + "&z=" + z);
        }

        /**
         * Get objects that intersects with point
         *
         * @param float $x
         * @param float $y
         *
         * @return string
         */
        public String getObjectsInPoint(float x, float y)
        {
            return doSendApiRequest("point", "&x=" + x + "&y=" + y);
        }

        /**
         * Get objects that determines search query
         * 
         * @param string $query
         *
         * @return string
         */
        public String getObjectsBySearchQuery(String query)
        {
            return doSendApiRequest("search", "&q=" + query);
        }

        /**
         * Send request to api
         * @param string $function
         * @param string $args
         * @return string
         */
        public String doSendApiRequest(String function, String args) {
            // if you dont have a key, create it on http://wikimapia.org/api/
            if( m_Key == null ) {
                return null;
            }

            // used to build entire input
            StringBuilder sb  = new StringBuilder();

            // used on each read operation
            byte[] buf = new byte[8192];

            // create a request
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(
                m_Url + "/?function=" + function + "&key=" + m_Key + "&format=" + m_Format 
                    + "&pack=" + m_Packing + "&language=" + m_Language + args
            );

            // execute the request
            HttpWebResponse response = (HttpWebResponse) request.GetResponse();

            // we will read data via the response stream
            Stream stream = response.GetResponseStream();

            string tempString = null;
            int count = 0;

            do
            {
                // fill the buffer with data
                count = stream.Read(buf, 0, buf.Length);

                // make sure we read some data
                if (count != 0)
                {
                    // translate from bytes to UTF-8 text
                    tempString = Encoding.UTF8.GetString(buf, 0, count);

                    // continue building the string
                    sb.Append(tempString);
                }
            }
            while (count > 0); // any more data to read?

            return sb.ToString();
        }
    }

}
