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

    return bless $self, $class;
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
    my ($x, $y, $z, $count) = @_;

    return $self->doSendApiRequest(
        "box",
        "x=" . $x . "&y=" . $y . "&z=" . $z . "&count=" . $count
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
    my ($q, $page) = @_;

    return $self->doSendApiRequest("search", "q=" . $q . "&page=" . $page);
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
