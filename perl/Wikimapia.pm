package Wikimapia;

use strict;
use warnings;

use LWP::UserAgent;

sub new {
    my $class = shift;
    my $key   = shift;

    my $ua =  LWP::UserAgent->new();
    my $self = {
        Url     => "http://api.wikimapia.org",
        Format  => "xml",  # xml, json, kml, binary
        Packing => "none", # gz, none
        Lang    => "en",
        Key     => $key,
        UA      => $ua,
    };

    return bless $self,$class;
};

sub getObjectsInBoxByLatLon
{
    my $self = shift;
    my ($lon_min, $lat_min, $lon_max, $lat_max) = @_;

    return $self->doSendApiRequest(
        "box",
        "lon_min=" . $lon_min . "&lat_min=" . $lat_min . "&lon_max=" . $lon_max . "&lat_max=" . $lat_max
    );
}

sub getObjectsInBoxByTile
{
    my $self = shift;
    my ($x, $y, $z) = @_;

    return $self->doSendApiRequest(
        "box",
        "x=" . $x . "&y=" . $y . "&z=" . $z
    );
}

sub getObjectsByPoint
{
    my $self = shift;
    my ($x, $y) = @_;

    return $self->doSendApiRequest(
        "point",
        "x=" . $x . "&y=" . $y
    );
}

sub getObjectsBySearchQuery
{
    my $self = shift;
    my ($q) = @_;

    return $self->doSendApiRequest("search", "q=" . $q);
}

sub getObjectsInBoxByBBox
{
    my $self = shift;
    my ($bbox) = @_;

    return $self->doSendApiRequest("box", "bbox=" . $bbox);
}

sub getObjectById
{
    my $self = shift;
    my ($objectId) = @_;

    return $self->doSendApiRequest("object", "id=" . $objectId);
}



sub doSendApiRequest #( String function, String args )
{
    my $self = shift;
    my ($function, $args) = @_;

    my $url =
    $self->{Url} .
        "/?function=" . $function .
        "&key=" . $self->{Key} .
        "&format=" . $self->{Format} .
        "&pack=" . $self->{Packing} .
        "&language=" . $self->{Lang} .
        "&" . $args;

    my $res = $self->{UA}->get($url);

    if ($res->is_success()) {
        return $res->decoded_content();
    }
}

1;

# Test
sub Test
{
    my $key = "F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B";
    my $obj = Wikimapia->new($key);

    print $obj->getObjectsBySearchQuery("Prizren");

    my $lon = 42.20626; #x
    my $lat = 20.72618; #y

    system("mkdir -p examples");

    for my $format qw(xml json kml) {
        $obj->{Format} = $format;
        open  OUT, ">examples/bbox$lat$lon.$format";
        print OUT $obj->getObjectsInBoxByLatLon(
            $lat - 0.05,
            $lon - 0.05,
            $lat + 0.05,
            $lon + 0.05,
        );
        close OUT;

        for my $id qw(22649808) {
            open  OUT, ">examples/$id.$format";
            print OUT $obj->getObjectById($id);
            close OUT;
        }

        # point
        open  OUT, ">examples/point.$format";
        print OUT $obj->getObjectsByPoint($lat, $lon);
        close OUT;
    } # for each format
}

Test;
