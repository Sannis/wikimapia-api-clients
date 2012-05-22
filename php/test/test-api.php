<?php

require_once(__DIR__ . "/../lib/wikimapia.php");

/**
 * Wikimapia API Client Tests Class
 */
class WikimapiaAPITests extends PHPUnit_Framework_TestCase
{
    public function testNew()
    {
        $api = new WikimapiaAPI("F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B");

        $this->assertTrue($api instanceof WikimapiaAPI);
    }

    /**
     * @expectedException ErrorException
     * @expectedExceptionMessage [Wikimapia API] Error: you should pass API key to WikimapiaAPI constructor
     */
    public function testBadKey()
    {
        $api = new WikimapiaAPI("");

        $xmlResponse = $api->getObjectById(55);

        // fake $result usage
        echo $xmlResponse;
    }

    public function testBox()
    {
        $api = new WikimapiaAPI("F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B", "json");

        $jsonResponse = $api->getObjectsInBoxByTile(33185, 22545, 16, 50);

        $jsonObject = json_decode($jsonResponse);

        $containsEiffel = array_reduce($jsonObject->folder, function (&$result, $item) {
            $isEiffel = ($item->id === "55") && ($item->name === "Eiffel Tower");

            $result = $result || $isEiffel;

            return $result;
        }, false);

        $this->assertTrue($containsEiffel);
    }

    public function testObject()
    {
        $api = new WikimapiaAPI("F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B", "json");

        $jsonResponse = $api->getObjectById(55);
        $jsonObject = json_decode($jsonResponse);

        $this->assertEquals(55, $jsonObject->id);
        $this->assertEquals("Eiffel Tower", $jsonObject->title);
        $this->assertEquals("France", $jsonObject->location->country);
    }

    public function testSearch()
    {
        $api = new WikimapiaAPI("F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B", "json");

        $containsEiffel = false;
        $page = 1;

        while (!($containsEiffel || ($page > 5))) {
            $jsonResponse = $api->getObjectsBySearchQuery("Eiffel Tower", $page);
            $jsonObject = json_decode($jsonResponse);

            $containsEiffel = array_reduce($jsonObject->folder, function (&$result, $item) {
                $isEiffel = ($item->id === 55) && ($item->name === "Eiffel Tower");

                $result = $result || $isEiffel;

                return $result;
            }, false);

            $page++;
        }

        $this->assertTrue($containsEiffel);
    }
}
