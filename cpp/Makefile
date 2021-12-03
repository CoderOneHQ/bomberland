CC=gcc
CXX=g++
RM=rm -f
CPPFLAGS=-std=c++11
LDFLAGS=
LDLIBS=

SRCS=agent.cpp game_state.cpp easywsclient/easywsclient.cpp

OBJS=$(subst .cpp,.o,$(SRCS))

all: agent

agent: $(OBJS)
	$(CXX) $(LDFLAGS) -o agent $(OBJS) $(LDLIBS)

depend: .depend

.depend: $(SRCS)
	$(RM) ./.depend
	$(CXX) $(CPPFLAGS) -MM $^>>./.depend;

clean:
	$(RM) $(OBJS)

distclean: clean
	$(RM) *~ .depend

include .depend

