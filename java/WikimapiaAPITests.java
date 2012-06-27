package org.wikimapia.api;

import WikimapiaAPI;

import junit.framework.Assert;
import org.junit.Test;

public class WikimapiaAPITests
{
    private WikimapiaAPI api;

    @Before
    public void before() {
        api = new WikimapiaAPI();
    }

    @After
    public void after() {
        api = null;
    }

    @Test
    public static void TestNew()
    {
        Assert.assertOk(1);
    }
}
