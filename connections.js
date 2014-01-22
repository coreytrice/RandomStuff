(function(Connections){
    Connections.View = Backbone.View.extend({
        el : '#interior',
        events : {
              'click #showFriends'          : 'showFriends'
            , 'click #showGroups'           : 'showGroups'
            , 'click #showFollowing'        : 'showFollowing'
            , 'click #showAll'              : 'showAll'
            , 'click #blockedFans'          : 'showBlockedFans'
            , 'click #blockedBands'         : 'showBlockedBands'
            , 'click #blockedCompanies'     : 'showBlockedCompanies'
            , 'click #blockedVenues'        : 'showBlockedVenues'
            , 'click #blockedAll'           : 'showBlockedAll'
            , 'click #showMore'             : 'refreshSuggestions'
            , 'click #suggestedFans'        : 'fanSuggestions'
            , 'click #suggestedBands'       : 'bandSuggestions'
            , 'click #suggestedCompanies'   : 'companySuggestions'
            , 'click #suggestedVenues'      : 'venueSuggestions'
            , 'click #suggestedAll'         : 'allSuggestions'
            , 'click #suggestionsHide'      : 'toggleSuggestions'
            , 'click #connectionsHide'      : 'toggleConnections'
            , 'click #blockedHide'          : 'toggleBlocked'
            , 'click .unfolGear'            : 'unfollow'
            , 'click .folGear'              : 'follow'
            , 'click .unblkGear'            : 'unblock'
            , 'click .blkGear'              : 'block'
            , 'keyup #myConnSrch'           : 'searchMyConnections'
        },
        initialize : function(){
            x       = null;
            timer   = null;
            wv      = new Connections.WatchingView();
        },
        render : function(){
            this.$('#suggestedAll').click();
            this.$('#showAll').click();
            this.$('#blockedAll').click();
        },
        gearNav : function(){
            $('.gear-right').gearnav();
        },
        follow : function(e){
            e.preventDefault();
            var   that      = this
                , id        = $(e.currentTarget).data('id')
                , target    = $(e.currentTarget)
                , parent    = target.closest('.zngine-panel')
                , cont      = target.closest('.container').data('container')
            ;

            $.ajax({
                type    : 'POST',
                url     : '/ds/owner/follow/' + id,
                success : function(data, status, xhr){
                    if(cont != 'watching'){
                        parent.remove();
                    }
                    if(cont == 'watching'){
                        wv.fetch();
                    }
                    that.$('#showAll').click();
                    that.refreshConnectionsMod();
                },
                error   : function(xhr, status, error){
                    //console.log(error);
                },
            });
        },
        unfollow : function(e){
            e.preventDefault();
            var   that      = this
                , id        = $(e.currentTarget).data('id')
                , target    = $(e.currentTarget)
                , parent    = target.closest('.zngine-panel')
                , cont      = target.closest('.container').data('container')
            ;
            
            //console.log('CONTAINER', cont);
            $.ajax({
                url     : '/ds/owner/follow/' + id,
                type    : 'DELETE',
                success : function(data, status, xhr){
                    if(cont != 'watching' && cont != 'blocked'){
                        parent.remove();
                    }
                    if(cont == 'blocked'){
                        that.$('#blockedAll').click();
                    }
                    if(cont == 'watching' || cont == 'connections'){
                        that.$('#showAll').click();
                        that.refreshConnectionsMod();
                        wv.fetch();
                    }
                },
                error   : function(xhr, status, error){
                    //console.log(error);
                },
            });
        },
        unblock : function(e){
            e.preventDefault();
            var   that      = this
                , id        = $(e.currentTarget).data('id')
                , target    = $(e.currentTarget)
                , parent    = target.closest('.zngine-panel')
                , cont      = target.closest('.container').data('container')
            ;

            $.ajax({
                url     : '/ds/owner/block/' + id,
                type    : 'DELETE',
                success : function(data, status, xhr){
                    parent.remove();
                    that.$('#showAll').click();
                    that.$('#blockedAll').click();
                    that.refreshConnectionsMod();
                    wv.fetch();
                },
                error   : function(xhr, status, error){
                    //console.log(error);
                },
            });
        },
        block : function(e){
            e.preventDefault();
            var   that      = this
                , id        = $(e.currentTarget).data('id')
                , target    = $(e.currentTarget)
                , parent    = target.closest('.zngine-panel')
                , cont      = target.closest('.container').data('container')
            ;

            $.ajax({
                url     : '/ds/owner/block/' + id,
                type    : 'POST',
                success : function(data, status, xhr){
                    if(cont == 'connections' || cont == 'watching'){
                        that.$('#showAll').click();
                    }
                    if(cont == 'watching'){
                        wv.fetch();
                    }
                    parent.remove();
                    that.$('#blockedAll').click();
                    that.refreshConnectionsMod();
                },
                error   : function(xhr, status, error){
                    //console.log(error);
                },
            });
        },
        showAll : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('cAll', target);
        },
        showFriends : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('cFriends', target);
        },
        showGroups : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('cGroups', target);
        },
        showFollowing : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('cFollowing', target);
        },
        showBlockedFans : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('bFans', target);
        },
        showBlockedBands : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('bBands', target);
        },
        showBlockedCompanies : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('bCompanies', target);
        },
        showBlockedVenues : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('bVenues', target);
        },
        showBlockedAll : function(e){
            e.preventDefault();
            var target = $(e.currentTarget).parent().next().next();
            this.displayResults('bAll', target);
        },
        fanSuggestions : function(e){
            e.preventDefault();
            this.renderSuggestions('fan', 5);
            var filter = $('#suggestedFans');
            this.setSugFilterActive(filter);
        },
        bandSuggestions : function(e){
            e.preventDefault();
            this.renderSuggestions('band', 5);
            var filter = $('#suggestedBands');
            this.setSugFilterActive(filter);
        },
        companySuggestions : function(e){
            e.preventDefault();
            this.renderSuggestions('company', 5);
            var filter = $('#suggestedCompanies');
            this.setSugFilterActive(filter);
        },
        venueSuggestions : function(e){
            e.preventDefault();
            this.renderSuggestions('venue', 5);
            var filter = $('#suggestedVenues');
            this.setSugFilterActive(filter);
        },
        allSuggestions : function(e){
            e.preventDefault();
            this.renderSuggestions('all', 5);
            var filter = $('#suggestedAll');
            this.setSugFilterActive(filter);
        },
        setSugFilterActive : function(tgt){
            $('.sugFilter').removeClass('active');
            tgt.addClass('active');
        },
        /**
         * This returns results to be displayed in the "my connections" and "blocked" sections on the 
         * connections page depending on the parameters passed
         * 
         * @param   string  type    takes a result type 
         * @param   string  target  takes the html target where the returned results should be displayed
         */
        displayResults : function(type, target){
            var   that      = this
                , selector  = $(target).data('id')
            ;

            if(selector == 'myConnections'){
                $.ajax({
                    url     : '/ds/profile/' + actor.subject._id + '/connections',
                    type    : 'GET',
                    success : function(data, status, xhr){
                        that.renderConnections(type, target, data);
                    },
                    error   : function(xhr, status, error){
                        //console.log(error);
                    },
                });
            }
            if(selector == 'myBlocked'){
                $.ajax({
                    url     : '/ds/profile/' + actor.subject._id + '/blocked',
                    type    : 'GET',
                    success : function(data, status, xhr){
                        that.renderBlocked(type, target, data);
                    },
                    error   : function(xhr, status, error){
                        //console.log(error);
                    },
                });
            }
        },
        renderConnections : function(type, target, data){
            var   that      = this
                , values    = {}
                , subProfId = actor.subject._id
                , prxProfId = actor.proxy._id
            ;

            values['type']      = type;
            values['friends']   = data.friends;
            values['following'] = data.following;
            values['groups']    = data.groups;
            values['blocked']   = data.blocked;
            values['subOwner']  = data.subOwner;

            $.ajax({
                url     : '/ds/profile/formatConnections',
                type    : 'POST',
                data    : values,
                success : function(data, status, xhr){
                    if(subProfId == prxProfId){
                        var template = Handlebars.templates['connections/myConnections'];
                        $(target).html(template({ connections : data.connections}));
                    }else{
                        var template = Handlebars.templates['connections/othersConnections'];
                        $(target).html(template({ connections : data.connections}));
                    }

                    $("#myConnectionsCount").text(data.connections.length);

                    if(type == 'cAll'){
                        $('#connModHead').html('CONNECTIONS (' + data.connections.length + ') <span class="right">VIEW ALL</span>');
                    }
                    that.gearNav();
                },
                error   : function(xhr, status, error){
                    //console.log('CONNECTIONS ERROR', error);
                },
            });
        },
        renderBlocked : function(type, target, data){
            var   that      = this
                , values    = {}
                , template  = Handlebars.templates['connections/blockedDetails'];
            ;

            values['type']      = type;
            values['blocked']   = data.blocked;
            values['subOwner']  = data.subOwner;

            $.ajax({
                url     : '/ds/profile/formatConnections',
                type    : 'POST',
                data    : values,
                success : function(data, status, xhr){
                    if(data.connections.length > 0){
                        $('#blocked-wrapper').show();
                        $(target).html(template({connections: data.connections}));
                        $("#myBlockedCount").text(data.connections.length);
                        that.gearNav();
                    }
                },
                error   : function(xhr, status, error){
                    //console.log('BLOCKED ERROR', error);
                },
            });
        },
        /**
         * This returns results to be displayed in the "suggestions" section on the connections page
         * depending on the parameters passed
         * 
         * @param   string  oType   takes any of the owner types from the database or "all"
         * @param   int     numRes  takes a number for the desired number of results to return
         */
        renderSuggestions : function(oType, numRes){
            var   that      = this
                , target    = $('#suggestions')
            ;

            if(!oType){
                oType = 'all';
            }

            if(!numRes){
                numRes = 5;
            }

            $.ajax({
                url     : '/ds/profiles/getSuggestions/' + oType + '/' + numRes,
                type    : 'GET',
                success : function(data, status, xhr){
                    var template = Handlebars.templates['connections/suggestions'];
                    target.html(template({suggestions : data.connections}));
                    that.gearNav();
                },
                error   : function(xhr, status, error){
                    //console.log('ERROR FROM renderSuggestions', error);
                },
            });
        },
        refreshSuggestions : function(e){
            e.preventDefault();
            var filter = $('.sugFilter.active').data('filter');
            this.renderSuggestions(filter, 10);
        },
        toggleSuggestions : function(e){
            e.preventDefault();
            var   view          = $('#suggestionsHide')
                , suggestions   = $('#conSuggestions .zngine-panel')
            ;

            if(suggestions.is(':visible')){
                suggestions.hide();
                view.text('View');
            }else{
                suggestions.show();
                view.text('Hide');
            }
        },
        toggleConnections : function(e){
            e.preventDefault();
            var   view          = $('#connectionsHide')
                , connections   = $('#connections-wrapper .zngine-panel')
            ;

            if(connections.is(':visible')){
                connections.hide();
                view.text('View');
            }else{
                connections.show();
                view.text('Hide');
            }
        },
        toggleBlocked : function(e){
            e.preventDefault();
            var   view      = $('#blockedHide')
                , blocked   = $('#blocked-wrapper .zngine-panel')
            ;

            if(blocked.is(':visible')){
                blocked.hide();
                view.text('View');
            }else{
                blocked.show();
                view.text('Hide');
            }
        },
        searchMyConnections : function(e){
            var   that          = this
                , search        = $(e.target)
                , searchTerm    = search.val()
                , output        = $('#myConnectionsResults')
                , subProfId     = actor.subject._id
                , prxProfId     = actor.proxy._id
            ;

            if(searchTerm.length < 2){
                that.clearMyConnectionsDisplay();
            }else{
                if(x){
                    x.abort();
                }
                clearTimeout(timer);
                timer = setTimeout(function(){
                    x = $.ajax({
                        url     : '/ds/profiles/searchMyConnections/' + searchTerm,
                        type    : 'GET',
                        success : function(data, status, xhr){
                            x = null;

                            $('#myConnectionsResults').show();
                            
                            if(subProfId == prxProfId){
                                //If looking at own page
                                var template = Handlebars.templates['connections/myConnections'];
                                output.html(template({connections : data.connections}));
                            }else{
                                //If looking at another user's page
                                //THIS SHOULD NOT BE HAPPENING AS OF 10/16/2013
                            }

                            that.gearNav();
                        },
                        error   : function(xhr,status,error){
                            //console.log('Error from searchMyConnections in connections.js', error);
                        },
                    });
                }, 500);
            }
        },
        clearMyConnectionsDisplay : function(){
            var disp = $('#myConnectionsResults');

            disp.hide();
            disp.html('');
        },
        refreshConnectionsMod : function(){
            var   that      = this
                , target    = $('#connMod')
                , subProfId = actor.subject._id
                , template  = Handlebars.templates['profile/connectionsMod']
                , numRslts  = 8
            ;

            $.ajax({
                url     : '/ds/profiles/getMyConnections/' + subProfId + '/' + numRslts,
                type    : 'GET',
                success : function(data, status, xhr){
                    target.html(template({connections : data.connections}))
                },
                error   : function(xhr, status, error){
                    //console.log('Error from refreshConnectionsMod', error);
                }
            });
        },
    });

})(zngine.module('connections'));

