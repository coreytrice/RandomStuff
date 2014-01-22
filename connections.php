<?php

namespace view\page\connections;

use view;

/**
 * This class is used for getting connections
 */
class index extends \view\AuthPage {

    public function init(){
        $this->refreshUserSession();
    }

    public function getMyBlocked(){
        $this->refreshUserSession();
        
        $blocked = $this->subject->blocked;

        foreach($blocked as $b){
            $query  = array('profile' => new \MongoId($b));
            $own    = \mongo\Owner::init()->get($query);
            $prof   = $own->profile;

            $formattedBlocked[] = $this->formatInformation($own, $prof);
        }
        return $formattedBlocked;
    }

    public function getMyGroups(){
        $this->refreshUserSession();

        $groups     = $this->subject->groups;
        $blocked    = $this->subject->blocked;

        foreach($groups as $group){
            if(in_array($group->group, $blocked)){
                //Do nothing
            }else{
                $query  = array('profile' => new \MongoId($group->group));
                $own    = \mongo\Owner::init()->get($query);
                $prof   = $own->profile;

                if($own->createdBy == $this->subject->profile->_id){
                    $formattedGroups[] = $this->formatInformation($own, $prof);
                }
            }
        }
        return $formattedGroups;
    }

    public function getMyFriends(){
        $this->refreshUserSession();

        $friends    = $this->getFriendsList();
        $blocked    = $this->subject->blocked;
        
        foreach ($friends as $friend) {
            if(in_array($friend, $blocked)){
                //Do nothing
            }else{
                $query              = array('profile' => new \MongoId($friend));
                $own                = \mongo\Owner::init()->get($query);
                $prof               = $own->profile;
                $formattedFriends[] = $this->formatInformation($own, $prof);
            }
        }

        return $formattedFriends;
    }

    public function getMyFollowing(){
        $this->refreshUserSession();

        $following  = $this->getFollowingList();
        $blocked    = $this->subject->blocked;

        foreach($following as $follow){
            if(in_array($follow, $blocked)){
                //Do nothing
            }else{
                $query                  = array('profile' => new \MongoId($follow));
                $own                    = \mongo\Owner::init()->get($query);
                $prof                   = $own->profile;
                $formattedFollowing[]   = $this->formatInformation($own, $prof);
            }
        }

        return $formattedFollowing;
    }

    public function getFriendsList(){
        $friends    = array();
        $following  = $this->subject->following;
        $blocked    = $this->subject->blocked;

        foreach($following as $f){
            if(in_array($f, $blocked)){
                //Do nothing
            }else{
                $query      = array('profile' => new \MongoId($f));
                $followed   = \mongo\Owner::init()->get($query);

                foreach($followed->following as $f2){
                    if($f2 == $this->subject->profile->_id){
                        $friends[] = $f;
                    }
                }
            }
        }

        return $friends;
    }

    public function getFollowingList(){
        $following      = array();
        $friends        = $this->getFriendsList();
        $followingArray = $this->subject->following;
        $blocked        = $this->subject->blocked;

        foreach($followingArray as $f){
            if(in_array($f, $friends) || in_array($f, $blocked)){
                //Do nothing
            }else{
                $following[] = $f;
            }
        }

        return $following;
    }

    public function getMyConnections(){
        $this->refreshUserSession();
        $friends        = $this->getFriendsList();
        $followingArray = $this->subject->following;
        $groups         = $this->subject->groups;
        $blocked        = $this->subject->blocked;
        $connections    = array();

        foreach($friends as $friend){
            if(in_array($friend, $connections) || in_array($friend, $blocked)){
                //Do nothing
            }else{
                $connections[] = $friend;
            }
        }
        foreach($groups as $group){
            if(in_array($group->group, $connections) || in_array($group->group, $blocked)){
                //Do nothing
            }else{
                $connections[] = $group->group;
            }
        }
        foreach($followingArray as $following){
            if(in_array($following, $connections) || in_array($following, $blocked)){
                //Do nothing
            }else{
                $connections[] = $following;
            }
        }

        foreach($connections as $con){
            $query                  = array('profile' => new \MongoId($con));
            $own                    = \mongo\Owner::init()->get($query);
            $prof                   = $own->profile;
            $formattedConnections[] = $this->formatInformation($own, $prof);
        }

        return $formattedConnections;
    }

    public function formatInformation($o, $p){
        $cty    = $p->location->city;
        $st     = $p->location->state;
        
        if(($cty && $cty != '') && ($st && $st != '')){
            $formattedGroupsTmp['location'] = $cty . ', ' . $st;
        }elseif($cty && $cty != ''){
            $formattedGroupsTmp['location'] = $cty;
        }elseif($st && $st != ''){
            $formattedGroupsTmp['location'] = $st;
        }else{
            $formattedGroupsTmp['location'] = false;
        }

        $formattedGroupsTmp['name']         = $o->getName();
        $formattedGroupsTmp['ownerType']    = $p->ownerType;
        $formattedGroupsTmp['link']         = '/'.$p->ownerType.'/'.$p->username;
        $formattedGroupsTmp['id']           = $p->_id;
        $formattedGroupsTmp['avatar']       = $p->avatar;
        $formattedGroups                    = $formattedGroupsTmp;

        return $formattedGroups;
    }

}
