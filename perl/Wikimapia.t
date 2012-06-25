package WikimapiaTest;

use strict;
use warnings;

use Test::More;
use JSON;
use List::MoreUtils;

use Wikimapia;
my $testApiKey = "F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B";

subtest "Box API", sub {
    my $api = Wikimapia->new($testApiKey);
    $api->{'Format'} = 'json';

    my $jsonResponse = $api->getObjectsInBoxByTile(33185, 22545, 16, 50);
    my $jsonObject = decode_json($jsonResponse);

    my $objects = $jsonObject->{'folder'};

    my $containsEiffel = List::MoreUtils::any(sub {
      ($_->{'id'} eq "55") && ($_->{'name'} eq "Eiffel Tower")
    }, @{$objects});

    ok($containsEiffel, "Found Eiffel Tower with Box API");

    done_testing(1);
};

subtest "Object API", sub {
    my $api = Wikimapia->new($testApiKey);
    $api->{'Format'} = 'json';

    my $jsonResponse = $api->getObjectById(55);
    my $jsonObject = decode_json($jsonResponse);

    is($jsonObject->{'id'}, 55, "Right id");
    is($jsonObject->{'title'}, "Eiffel Tower", "Right title");
    is($jsonObject->{'location'}->{'country'}, "France", "Right country name");

    done_testing(3);
};

subtest "Search API", sub {
    my $api = Wikimapia->new($testApiKey);
    $api->{'Format'} = 'json';

    my $containsEiffel = 0;
    my $page = 1;

    while (!($containsEiffel || ($page > 5))) {
        my $jsonResponse = $api->getObjectsBySearchQuery("Eiffel Tower", $page);
        my $jsonObject = decode_json($jsonResponse);

        my $objects = $jsonObject->{'folder'};

        $containsEiffel = List::MoreUtils::any(sub {
          ($_->{'id'} eq "55") && ($_->{'name'} eq "Eiffel Tower")
        }, @{$objects});

        $page++;
    }

    ok($containsEiffel, "Found Eiffel Tower with Search API");

    done_testing(1);
};

done_testing(3);
